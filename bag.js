export let bag =  JSON.parse(localStorage.getItem('bag'));

export function saveToStorage() {
    localStorage.setItem('bag',JSON.stringify(bag));
}
export function addToBag(productId) {
    let matchingItem;

    bag.forEach((bagItem) => {
        if(productId === bagItem.productId) {
            matchingItem = bagItem;
        }
    });

    if(matchingItem){
        matchingItem.quantity += 1;
    }else{
        bag.push({
            productId: productId,
            quantity: 1
        });
    }
    saveToStorage();
}

export function removeFromBag(productId) {
    const newBag = [];

    bag.forEach((bagItem)  => {
        if(bagItem.productId !== productId){
            newBag.push(bagItem);
        }
    });
    bag = newBag;
    saveToStorage();
}