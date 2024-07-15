export default class Item {
  name: string;

  username: string;

  password: string;

  website: string;

  totp: string;

  isFavourite: boolean;

  constructor(name: string, username: string, password: string) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.website = "";
    this.totp = "";
    this.isFavourite = false;
  }
}
