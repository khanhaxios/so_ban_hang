export function ProductModel(id, image, name, price, desc, originPrice, discount, barCode, quantity, quantityType, categoryId, productTypeId, storeId) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.price = price;
    this.desc = desc;
    this.originPrice = originPrice;
    this.discount = discount;
    this.barCode = barCode;
    this.quantity = quantity;
    this.quantityType = quantityType;
    this.categoryId = categoryId;
    this.productTypeId = productTypeId;
    this.storeId = storeId;
}
