/**
 * @see https://remix.run/docs/en/main/guides/manual-mode#keeping-in-memory-server-state-across-rebuilds
 * @see https://www.freecodecamp.org/news/singleton-design-pattern-with-javascript/
 */

type User = {
  token: string;
  expires: number;
};

export type SpotifyResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

class AuthUser {
  #user: User | null = null;

  get user() {
    return this.#user;
  }

  setUser({ access_token, token_type, expires_in }: SpotifyResponse) {
    this.#user = {
      token: `${token_type} ${access_token}`,
      expires: Date.now() + expires_in,
    };
  }
}

const singleton = Object.freeze(new AuthUser());
export default singleton;

// class StateUtility {
//   constructor() {
//     if (instance) {
//       throw new Error("New instance cannot be created!!");
//     }

//     instance = this;
//   }

//   getPropertyByName(propertyName) {
//     return globalState[propertyName];
//   }

//   setPropertyValue(propertyName, propertyValue) {
//     globalState[propertyName] = propertyValue;
//   }
// }

// const stateUtilityInstance = Object.freeze(new StateUtility());

// export default stateUtilityInstance;
