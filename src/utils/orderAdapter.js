// Utility to normalize order payloads before passing to PaymentStatusPage
// Ensures images, totals, and item identifiers are present and consistent.
export function adaptOrderForPaymentStatus({ orderResponse = {}, itemsPayload = [], subtotal = 0, shippingCost = 0 }) {
  const normalizedSubtotal = Number(orderResponse.subtotal ?? subtotal ?? 0);
  const normalizedShipping = Number(orderResponse.shipping_cost ?? shippingCost ?? 0);
  const normalizedTotal = Number(
    orderResponse.total_amount ?? orderResponse.total ?? normalizedSubtotal + normalizedShipping
  );

  const normalizedItems = itemsPayload.map((item, idx) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return {
      id: item.product_id || item.id || `item-${idx}`,
      product_id: item.product_id || item.id || null,
      name: item.product_name || item.name || "Produk",
      price,
      quantity,
      image:
        item.product_image ||
        item.image ||
        item.primary_image ||
        item.image_url ||
        "https://via.placeholder.com/80?text=Produk",
      variant_name: item.variant_name || item.variant,
      variant_value: item.variant_value,
    };
  });

  return {
    ...orderResponse,
    subtotal: normalizedSubtotal,
    shipping_cost: normalizedShipping,
    total: normalizedTotal,
    items: normalizedItems,
  };
}
