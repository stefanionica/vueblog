export interface Post  {
    id:number,
    title: string,
    content: string,
    categoryId: number,
    date: Date,
    categoryName?: string,
    images?:string,
}
