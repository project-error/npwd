import { CreatePlayerInstance } from './player.interfaces';

export class Player {
  public readonly source: number;
  public readonly username: string;
  private _phoneNumber: string;
  private _identifier: string;
  private _firstname: string | null;
  private _lastname: string | null;

  constructor({ source, identifier, phoneNumber, username }: CreatePlayerInstance) {
    this.source = source;
    this._identifier = identifier;
    this._phoneNumber = phoneNumber;
    this.username = username;
  }

  public getIdentifier(): string {
    return this._identifier;
  }

  /**
   * Set the identifier for a player, useful in systems with multicharacter
   * players
   * @param identifier {string} - Set the identifier for a player
   */
  public setIdentifier(identifier: string): Player {
    this._identifier = identifier;
    return this;
  }

  /**
   * Returns the stored firstname for a user
   */
  public getFirstName(): string | null {
    return this._firstname;
  }

  /**
   * Set the first name for a user
   * @param firstname {string} The first name to set for the user
   **/
  public setFirstName(firstname: string): Player {
    this._firstname = firstname;
    return this;
  }

  /**
   * Returns the stored lastname for a user
   **/
  public getLastName(): string | null {
    return this._lastname;
  }

  /**
   * Set the last name for a user
   * @param lastname {string} The last name to set for the user
   **/
  public setLastName(lastname: string): Player {
    this._lastname = lastname;
    return this;
  }

  /**
   * Get the full name of the user
   **/
  public getName(): string | null {
    if (!this._firstname || !this._lastname) return null;
    return `${this._firstname} ${this._lastname}`;
  }

  /**
   * Get the stored phone number for a user
   **/
  public getPhoneNumber(): string {
    return this._phoneNumber;
  }

  /**
   * Set the stored phone number for a user
   **/
  public setPhoneNumber(number: string): Player {
    this._phoneNumber = number;
    return this;
  }
}
