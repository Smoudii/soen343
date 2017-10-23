let Laptop = require('../../domain-layer/classes/laptop');
let LaptopTDG = require('../../data-source-layer/TDG/laptopTDG');
let IdentityMap = require('../identity-map/idMap');

/**
 * Laptop object mapper
 * @class LaptopMapper
 * @export
 */
class LaptopMapper {
  /**
   * Creates a new laptop
   * @static
   * @param {string} model model number of laptop.
   * @param {string} brand brand of laptop.
   * @param {number} display  size of laptop screen.
   * @param {string} processor processor in laptop.
   * @param {number} ram ram amount in laptop.
   * @param {number} storage storage size of laptop.
   * @param {number} cores amount of cores in processor in laptop.
   * @param {string} os operating system of laptop.
   * @param {string} battery battery information of laptop.
   * @param {string} camera camera information of laptop.
   * @param {boolean} touch is display touch or not.
   * @param {string} dimensions dimensions of laptop.
   * @param {number} weight weight of laptop.
   * @param {number} price price of laptop
   * @return laptop object.
   */
    static makeNew(model, brand, display, processor, ram, storage, cores, os, battery, camera, touch, dimensions, weight, price) {
        let laptop = new Laptop(model, brand, display, processor, ram, storage, cores, os, battery, camera, touch, dimensions, weight, price);
        UOW.registerNew(laptop);
        return laptop;
    }

  /**
   * Registers an object dirty in the UOW
   * @static
   * @param {Object} laptop an object of type laptop.
   */
    static makeUpdate(laptop) {
        UOW.registerDirty(laptop);
    }

   /**
    * Registers an object deleted in the UOW
    * @static
    * @param {Object} laptop an object of type laptop.
    */
    static makeDeletion(laptop) {
        UOW.registerDeleted(laptop);
    }

   /**
    * Commits the UOW
    * @static
    */
    static commit() {
        UOW.commit();
    }

  /**
   * Maps the returned value to an object of type laptop.
   * @static
   * @param {string} id model number of laptop to be found.
   * @return laptop object.
   */
    static find(id, callback) {
        LaptopTDG.find(id, function(err, result) {
            if (err) {
                console.log('Error during laptop find query', null);
            } else {
                let value = result[0];
                return callback(null, new Laptop(value.model, value.brand, value.display, value.processor,
                    value.ram, value.storage, value.cores, value.os,
                    value.battery, value.camera, value.touch, value.dimensions,
                    value.weight, value.price));
            }
        });
    }

  /**
   * Maps all returned values into objects of type laptop.
   * @static
   * @return array of laptop objects.
   */
    static findAll(callback) {
        LaptopTDG.findAll(function(err, result) {
            let laptops = [];
            if (err) {
                console.log('Error during laptop findAll query', null);
            } else {
                for (let value of result) {
                    laptops.push(new Laptop(value.model, value.brand, value.display, value.processor,
                        value.ram, value.storage, value.cores, value.os,
                        value.battery, value.camera, value.touch, value.dimensions,
                        value.weight, value.price));
                }
                return callback(null, laptops);
            }
        });
    }

  /**
   * Maps an objects attributes to seperate values for TDG insert method.
   * @static
   * @param {Object} laptopObject an object of type laptop.
   */
    static insert(laptopObject) {
        LaptopTDG.insert(laptopObject.model, laptopObject.brand, laptopObject.display, laptopObject.processor,
            laptopObject.ram, laptopObject.storage, laptopObject.cores, laptopObject.os,
            laptopObject.battery, laptopObject.camera, laptopObject.touch, laptopObject.dimensions,
            laptopObject.weight, laptopObject.price);
    }

  /**
   * Maps an objects attributes to seperate values for TDG update method.
   * @static
   * @param {Object} laptopObject an object of type laptop.
   */
    static update(laptopObject) {
        LaptopTDG.update(laptopObject.model, laptopObject.brand, laptopObject.display, laptopObject.processor,
            laptopObject.ram, laptopObject.storage, laptopObject.cores, laptopObject.os,
            laptopObject.battery, laptopObject.camera, laptopObject.touch, laptopObject.dimensions,
            laptopObject.weight, laptopObject.price);
    }

  /**
   * Extracts an objects id to use with TDG delete method.
   * @static
   * @param {Object} laptopObject an object of type laptop.
   */
    static delete(laptopObject) {
            LaptopTDG.delete(laptopObject.model);
    }
}

module.exports = LaptopMapper;
