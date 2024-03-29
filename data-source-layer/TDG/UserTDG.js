let db = require('../../data-source-layer/db/index');

/**
 * User table data gateway
 * @class UserTDG
 * @export
 */
class UserTDG {
  /**
   * Finds one object from the user table.
   * @static
   * @param {string} email email of the user to be found.
   * @param {function} callback function that holds user object.
   */
    static find(email, callback) {
        db.query('SELECT * FROM users LEFT JOIN activeusers ON users.id = activeusers.user_id WHERE users.email=$1', [email], (err, result) => {
            if (err) {
                console.log(err.message);
            } else {
                return callback(null, result.rows);
            }
        });
    }

// TODO: update query to select from activeusers as well
  /**
   * Finds all objects from the user table.
   * @static
   * @param {function} callback function that holds array of user object.
   */
    static findAll(callback) {
        db.query('SELECT * FROM users', (err, result) => {
            if (err) {
                console.log(err.message);
            } else {
                return callback(null, result.rows);
            }
        });
    }

  /**
   * Inserts an object into the user table.
   * @static
   * @param {boolean} isadmin is user client or admin
   * @param {string} firstname first name of user
   * @param {string} lastname last name of user
   * @param {string} address home address of user
   * @param {string} email email of user
   * @param {number} phone phone number of user
   * @param {string} password password of user
   * @param {function} callback
   */
    static insert(firstname, lastname, address, email, phone, password, isadmin, sessionid, id, callback) {
        let queryString = 'INSERT INTO users (isadmin, firstname, lastname, address, email, phone, password) VALUES($1, $2, $3, $4, $5, $6, $7)';
        let queryValues = [isadmin, firstname, lastname, address, email, phone, password];

        // TODO update userObject ID once query completed
        // OR
        // query to get next available primary key
        db.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            return callback(err, result);
        });
    }

  /**
   * Updates an object in the user table.
   * @static
   * @param {boolean} isadmin is user client or admin
   * @param {string} firstname first name of user
   * @param {string} lastname last name of user
   * @param {string} address home address of user
   * @param {string} email email of user
   * @param {number} phone phone number of user
   * @param {function} callback
   */
    static update(firstname, lastname, address, email, phone, password, isadmin, sessionid, id, callback) {
        let queryString = 'UPDATE users SET isadmin=$1, firstname=$2, lastname=$3, address=$4, phone=$6 WHERE email=$5';
        let queryValues = [isadmin, firstname, lastname, address, email, phone];

        db.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            return callback(err, result);
        });
    }

    /**
     * Updates user's login session in the activeusers table
     * @param {string} id the id of user
     * @param {string} sessionid the sessionid for login
     */
    static updateLoginSession(id, sessionid) {
        let queryString = 'INSERT INTO activeusers (user_id, sessionid) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET sessionid=$2;';
        let queryValues = [id, sessionid];

        db.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    /**
     * Deletes all the login sessions from the active users table.
     * Intended for use on startup, express memory-store will always be clear on server startup.
     * @static
     */
    static clearAllLoginSessions() {
        let queryString = 'DELETE FROM activeusers *';

        db.query(queryString, null, (err, result) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

  /**
   * Deletes an objects in the user table.
   * @static
   * @param {string} email email of user to be deleted.
   * @param {function} callback
   */
    static delete(email, callback) {
      db.query('DELETE FROM users WHERE email=$1', [email], (err, result) =>{
          if (err) {
              console.log(err.message);
          }
          console.log('This user has been deleted from the database');
          return callback(err, result);
      });
    }
}

module.exports = UserTDG;
