export class UserModel{
    constructor(
        public id: number,
        public userName: string,
        public password: string,
        public email: string,
        public roles: string[]
    ){}
}