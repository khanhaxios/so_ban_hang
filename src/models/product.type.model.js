export function ProductTypeModel(id, name, image, price, originPrice, code, discountPrice, singlePrice, isShow, storeId) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.price = price;
    this.discountPrice = discountPrice;
    this.singlePrice = singlePrice;
    this.isShow = isShow;
    this.storeId = storeId;
}