# Admin Payment Verification - Visual Flow Diagram

## Complete System Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BUYER FLOW                                    │
└──────────────────────────────────────────────────────────────────────┘

    [Browse Products] 
           ↓
    [Add to Cart]
           ↓
    [Checkout - Select Seller Items]
           ↓
    ┌────────────────────────────┐
    │ POST /buyer/orders/checkout │
    │                            │
    │ Input:                     │
    │ - seller_id                │
    │ - shipping_address_id      │
    │ - bank_account_id          │
    │ - buyer_notes (optional)   │
    └────────────┬───────────────┘
                 ↓
    ┌────────────────────────────┐
    │ Order Created              │
    │ Status:                    │
    │ - payment: unpaid          │
    │ - order: pending           │
    └────────────┬───────────────┘
                 ↓
    [Buyer sees bank transfer details]
           ↓
    [Buyer makes bank transfer]
           ↓
    [Buyer uploads payment proof]
           ↓
    ┌──────────────────────────────────────┐
    │ POST /buyer/orders/:id/payment-proof │
    │                                      │
    │ Input: payment_proof (file)          │
    └──────────────┬───────────────────────┘
                   ↓
    ┌────────────────────────────┐
    │ Payment Proof Uploaded     │
    │ Status:                    │
    │ - payment:                 │
    │   pending_verification     │
    │ - order: pending           │
    └────────────┬───────────────┘
                 ↓
    [Wait for admin verification...]


┌──────────────────────────────────────────────────────────────────────┐
│                         ADMIN FLOW                                    │
└──────────────────────────────────────────────────────────────────────┘

    [Admin logs in to dashboard]
           ↓
    ┌────────────────────────────────┐
    │ GET /admin/payments/pending    │
    │                                │
    │ Filters:                       │
    │ - status (default: pending)    │
    │ - seller_id                    │
    │ - search                       │
    │ - page, limit                  │
    └────────────┬───────────────────┘
                 ↓
    [Admin sees list of orders with payment proofs]
           ↓
    [Admin clicks on order to review]
           ↓
    ┌────────────────────────────────┐
    │ GET /admin/payments/:orderId   │
    └────────────┬───────────────────┘
                 ↓
    ┌────────────────────────────────┐
    │ Admin sees:                    │
    │ - Payment proof image/file     │
    │ - Order details                │
    │ - Buyer information            │
    │ - Seller information           │
    │ - Bank account details         │
    │ - Amount to verify             │
    └────────────┬───────────────────┘
                 ↓
    [Admin reviews payment proof]
           ↓
           │
      ┌────┴────┐
      ↓         ↓
  [APPROVE]  [REJECT]


┌──────────────────────────────────────────────────────────────────────┐
│                    ADMIN APPROVE FLOW                                 │
└──────────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────┐
    │ PUT /admin/payments/:id/approve    │
    │                                    │
    │ Input (optional):                  │
    │ - admin_notes                      │
    └────────────┬───────────────────────┘
                 ↓
    ┌────────────────────────────────────┐
    │ System Updates:                    │
    │ - payment_status: paid             │
    │ - order_status: processing         │
    │ - paid_at: current timestamp       │
    │ - payment_verified_by: admin_id    │
    │ - payment_verified_at: timestamp   │
    │ - seller_notes: admin_notes        │
    └────────────┬───────────────────────┘
                 ↓
    ┌────────────────────────────────────┐
    │ Order Status: PROCESSING           │
    │                                    │
    │ Seller can now:                    │
    │ - Process the order                │
    │ - Prepare items for shipping       │
    └────────────────────────────────────┘
           ↓
    [Seller processes order]
           ↓
    [Ship to buyer]
           ↓
    [Delivered]
           ↓
    [Completed]


┌──────────────────────────────────────────────────────────────────────┐
│                    ADMIN REJECT FLOW                                  │
└──────────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────┐
    │ PUT /admin/payments/:id/reject     │
    │                                    │
    │ Input (REQUIRED):                  │
    │ - rejection_reason                 │
    └────────────┬───────────────────────┘
                 ↓
    ┌────────────────────────────────────┐
    │ System Updates:                    │
    │ - payment_status: rejected         │
    │ - order_status: pending            │
    │ - payment_verified_by: admin_id    │
    │ - payment_rejected_at: timestamp   │
    │ - payment_rejection_reason: saved  │
    └────────────┬───────────────────────┘
                 ↓
    ┌────────────────────────────────────┐
    │ Buyer notified:                    │
    │ "Your payment proof was rejected"  │
    │                                    │
    │ Reason shown to buyer:             │
    │ e.g., "Bukti transfer tidak jelas" │
    └────────────┬───────────────────────┘
                 ↓
    [Buyer sees rejection message]
           ↓
    [Buyer can re-upload new proof]
           ↓
    ┌──────────────────────────────────────┐
    │ POST /buyer/orders/:id/payment-proof │
    │ (Re-upload allowed)                  │
    └──────────────┬───────────────────────┘
                   ↓
    ┌────────────────────────────────────┐
    │ System Updates:                    │
    │ - payment_status:                  │
    │   pending_verification (reset)     │
    │ - payment_rejected_at: null        │
    │ - payment_rejection_reason: null   │
    │ - payment_proof: new file          │
    └────────────┬───────────────────────┘
                 ↓
    [Back to admin review queue]
           ↓
    [Admin reviews again...]


┌──────────────────────────────────────────────────────────────────────┐
│                    STATUS TRANSITION DIAGRAM                          │
└──────────────────────────────────────────────────────────────────────┘

Payment Status:
═══════════════

    unpaid
       │
       │ Buyer uploads proof
       ↓
    pending_verification  ←──────────┐
       │                             │
       │                             │ Buyer re-uploads
  ┌────┴────┐                       │
  ↓         ↓                        │
approved  rejected ──────────────────┘
  │
  ↓
 paid


Order Status:
═════════════

    pending
       │
       │ Payment approved
       ↓
    processing
       │
       │ Seller ships
       ↓
    shipped
       │
       │ Delivered
       ↓
    delivered
       │
       │ Auto/Manual completion
       ↓
    completed

    (Can be cancelled from pending/processing)


┌──────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW DIAGRAM                                  │
└──────────────────────────────────────────────────────────────────────┘

┌─────────┐         ┌─────────┐         ┌─────────┐
│  Buyer  │────────▶│  Order  │◀────────│  Admin  │
└─────────┘         └────┬────┘         └─────────┘
     │                   │                    │
     │                   │                    │
     │ Creates           │ Reviews            │ Verifies
     │ Uploads           │ Checks             │ Approves
     │ Re-uploads        │ Filters            │ Rejects
     │                   │                    │
     ↓                   ↓                    ↓
┌─────────────────────────────────────────────────┐
│              Orders Table                       │
│  ─────────────────────────────────────────────  │
│  order_id, order_number                         │
│  buyer_id, seller_id                            │
│                                                 │
│  Payment Fields:                                │
│  - payment_status                               │
│  - payment_proof (file path)                    │
│  - paid_at                                      │
│                                                 │
│  Verification Fields (NEW):                     │
│  - payment_verified_by (admin user_id)          │
│  - payment_verified_at                          │
│  - payment_rejected_at                          │
│  - payment_rejection_reason                     │
│                                                 │
│  Order Fields:                                  │
│  - order_status                                 │
│  - total_amount                                 │
│  - shipping_address                             │
│  - bank_account_id                              │
└─────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────┐
│                    FILTER & SEARCH FLOW                               │
└──────────────────────────────────────────────────────────────────────┘

Admin Dashboard:
═══════════════

┌────────────────────────────────────────┐
│  Payment Verification Queue            │
│  ────────────────────────────────────  │
│                                        │
│  Filters:                              │
│  [Status: Pending ▼] [Seller: All ▼]  │
│  [Search: ____________________]        │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ ORD-20241112-00001              │ │
│  │ Buyer: John Doe                  │ │
│  │ Amount: Rp 150,000               │ │
│  │ [View] [Approve] [Reject]        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ ORD-20241112-00002              │ │
│  │ Buyer: Jane Smith                │ │
│  │ Amount: Rp 200,000               │ │
│  │ [View] [Approve] [Reject]        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [← Previous]  Page 1 of 5  [Next →]  │
└────────────────────────────────────────┘


Query Examples:
══════════════

1. Default (Pending only):
   GET /admin/payments/pending

2. Show rejected:
   GET /admin/payments/pending?status=rejected

3. Show all with proofs:
   GET /admin/payments/pending?status=all

4. Filter by seller:
   GET /admin/payments/pending?seller_id=1

5. Search by order number:
   GET /admin/payments/pending?search=ORD-20241112

6. Combine filters:
   GET /admin/payments/pending?status=pending_verification
                               &seller_id=1
                               &page=2
                               &limit=20


┌──────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                                │
└──────────────────────────────────────────────────────────────────────┘

Approval Errors:
═══════════════

┌─────────────────────────────┐
│ Admin clicks Approve        │
└──────────┬──────────────────┘
           ↓
    ┌──────────────┐
    │ Validations: │
    └──────┬───────┘
           │
           ├─→ No payment proof? → 400 Error
           │   "Order belum memiliki bukti pembayaran"
           │
           ├─→ Already paid? → 400 Error
           │   "Status saat ini: paid"
           │
           ├─→ Order not found? → 404 Error
           │   "Order tidak ditemukan"
           │
           └─→ Not admin? → 403 Error
               "Access denied"


Rejection Errors:
════════════════

┌─────────────────────────────┐
│ Admin clicks Reject         │
└──────────┬──────────────────┘
           ↓
    ┌──────────────┐
    │ Validations: │
    └──────┬───────┘
           │
           ├─→ No rejection reason? → 400 Error
           │   "Alasan penolakan wajib diisi"
           │
           ├─→ No payment proof? → 400 Error
           │   "Order belum memiliki bukti pembayaran"
           │
           ├─→ Already paid? → 400 Error
           │   "Status saat ini: paid"
           │
           └─→ Order not found? → 404 Error
               "Order tidak ditemukan"


Re-upload Errors:
════════════════

┌─────────────────────────────┐
│ Buyer tries to re-upload    │
└──────────┬──────────────────┘
           ↓
    ┌──────────────┐
    │ Validations: │
    └──────┬───────┘
           │
           ├─→ Already paid? → 400 Error
           │   "Order sudah dibayar"
           │
           ├─→ No file uploaded? → 400 Error
           │   "File bukti pembayaran wajib diupload"
           │
           └─→ Not own order? → 404 Error
               "Order tidak ditemukan"


┌──────────────────────────────────────────────────────────────────────┐
│                    TIMELINE EXAMPLE                                   │
└──────────────────────────────────────────────────────────────────────┘

Day 1, 10:00 AM
│  Buyer creates order
│  Status: unpaid / pending
↓

Day 1, 10:15 AM
│  Buyer makes bank transfer
│  (outside system)
↓

Day 1, 10:30 AM
│  Buyer uploads payment proof
│  Status: pending_verification / pending
↓

Day 1, 2:00 PM
│  Admin reviews payment
│  Sees proof is unclear
│  Rejects with reason
│  Status: rejected / pending
↓

Day 1, 3:00 PM
│  Buyer sees rejection
│  Reads reason
│  Takes clearer photo
│  Re-uploads proof
│  Status: pending_verification / pending
↓

Day 1, 4:00 PM
│  Admin reviews again
│  Proof is now clear
│  Approves payment
│  Status: paid / processing
↓

Day 2, 9:00 AM
│  Seller processes order
│  Prepares items
↓

Day 2, 3:00 PM
│  Seller ships order
│  Status: paid / shipped
↓

Day 4, 10:00 AM
│  Package delivered
│  Status: paid / delivered
↓

Day 5, 10:00 AM
│  Order completed
│  Status: paid / completed
│  ✓ Transaction complete


═══════════════════════════════════════════════════════════════════════

End of Visual Flow Diagram
Generated: November 12, 2024
Version: 1.0.0

═══════════════════════════════════════════════════════════════════════
