let db = require('../../db/index');

/**
 * Television table data gateway
 * @class televisionTDG
 * @export
 */
class televisionTDG {
  /**
   * Finds one object from the television table.
   * @static
   * @param {string} id model number of television to be found.
   */
    static find(id) {
        db.query('SELECT * FROM television WHERE "modelId"=$1', [id], (err, result) => {
            if (err) {
                console.log(err.message);
            }
            return result.rows;
        });
    }

  /**
   * Finds all objects from the television table.
   * @static
   */
    static findAll() {
        db.query('SELECT * FROM television', (err, result) => {
            if (err) {
                console.log(err.message);
            }
            return result.rows;
        });
    }

  /**
   * Inserts an object into the television table.
   * @static
   * @param {string} modelNumber model number of television.
   * @param {string} brand brand of television.
   * @param {string} dimensions dimensions of television.
   * @param {number} weight weight of television.
   * @param {number} price price of television.
   */
    static insert(modelNumber, brand, dimensions, weight, price) {
        let queryString = 'INSERT INTO television VALUES($1, $2, $3, $4, $5)';
        let queryValues = [modelNumber, brand, dimensions, weight, price];

        db.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

  /**
   * Updates an object in the television table.
   * @static
   * @param {string} modelNumber model number of television.
   * @param {string} brand brand of television.
   * @param {string} dimensions dimensions of television.
   * @param {number} weight weight of television.
   * @param {number} price price of television
   */
    static update(modelNumber, brand, dimensions, weight, price) {
        let queryString = 'UPDATE television SET brand=$2, dimensions=$3, weight=$4, price=$5 WHERE "modelId"=$1';
        let queryValues = [modelNumber, brand, dimensions, weight, price];

        db.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

  /**
   * Deletes an objects in the television table.
   * @static
   * @param {string} id model number of television to be deleted.
   */
    static delete(id) {
      db.query('DELETE FROM television WHERE "modelId"=$1', [id], (err, result) =>{
          if (err) {
              console.log(err.message);
          }
          console.log('This television has been deleted from the database');
      });
    }
}

module.exports = televisionTDG;
