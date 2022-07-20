export class UserModel {
    constructor(
        public id: String,
        public name: String,
        public username: String,
        public email: String,
        public password: String,
        public role: String
    ){}
}