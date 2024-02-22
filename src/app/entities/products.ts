export interface IProduct {
  id: number;
  name: string;
  date: string;
  quantity:number;
  sold:number;
  description: string;
  price: number;
  rating: number;
  categoryId:number;
  imageUrl: string;
  mate:string;
  discountedPrice?: number;
  img2:string;
}
