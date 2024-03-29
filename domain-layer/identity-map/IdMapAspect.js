let meld = require('meld');
let DesktopMapper = require('../mappers/DesktopMapper');
let LaptopMapper = require('../mappers/LaptopMapper');
let MonitorMapper = require('../mappers/MonitorMapper');
let TabletMapper = require('../mappers/TabletMapper');
let ItemMapper = require('../mappers/ItemMapper');
let UserMapper = require('../mappers/UserMapper');
let DesktopTDG = require('../../data-source-layer/TDG/DesktopTDG');
let TabletTDG = require('../../data-source-layer/TDG/TabletTDG');
let LaptopTDG = require('../../data-source-layer/TDG/LaptopTDG');
let MonitorTDG = require('../../data-source-layer/TDG/MonitorTDG');
let ItemTDG = require('../../data-source-layer/TDG/ItemTDG');
let UserTDG = require('../../data-source-layer/TDG/UserTDG');


// // map all Mappers and TDGs to advices
let arrMapper = [DesktopMapper, TabletMapper, MonitorMapper, LaptopMapper, ItemMapper, UserMapper];
arrMapper.map((object) => meld.around(object, ['find'], findAdvice));
arrMapper.map((object) => meld.around(object, ['findAll'], findAllAdvice));
arrMapper.map((object) => meld.around(object, ['insert'], insertAdvice));
arrMapper.map((object) => meld.around(object, ['update'], updateAdvice));
arrMapper.map((object) => meld.around(object, ['delete'], deleteAdvice));

/**
 * [findAdvice description]
 * @param  {[type]} methodCall [description]
 * @return {[type]}            [description]
 */
function findAdvice(methodCall) {
    console.log('findAdvice');
    let id = methodCall.args[0];
    let callback = methodCall. args[1];
    let className = getClassNameHelper(meld.joinpoint().target.name);
    let classTDG = getTDGHelper(className);
    let classMapper = getMapperHelper(className);
        let object = idMap.get(className, id);
        if (object != null) {
            return callback(null, object);
        } else {
            classTDG.find(id, function(err, result) {
                if (err) {
                    console.log('Error during find query', null);
                } else {
                    let value = result[0];
                    if (result.length==0) {
                        return callback(err, null);
                    } else {
                        let object = classMapper.create(...getAttributesHelper(value, className));
                        idMap.add(object, id);
                        return callback(null, object);
                    }
                }
            });
        }
}

/**
 * [findAllAdvice description]
 * @param  {[type]} methodCall [description]
 */
function findAllAdvice(methodCall) {
    console.log('findAllAdvice');
    let callback = methodCall.args[0];
    let className = getClassNameHelper(meld.joinpoint().target.name);
    let classTDG = getTDGHelper(className);
    let classMapper = getMapperHelper(className);
    classTDG.findAll(function(err, result) {
        let objects = [];
        if (err) {
            console.log('Error during desktop findALL query', null);
        } else {
            for (let value of result) {
                let object = classMapper.create(...getAttributesHelper(value, className));
                let id = object[Object.keys(object)[0]];
                objects.push(object);
                if (idMap.get(className, id) == null) {
                    idMap.add(object, id);
                }
            }
            return callback(null, objects);
        }
    });
}

/**
 * [insertAdvice description]
 * @param  {[type]} methodCall [description]
 */
function insertAdvice(methodCall) {
    console.log('insertAdvice');
    let className = getClassNameHelper(meld.joinpoint().target.name);
    let classTDG = getTDGHelper(className);
    let object = methodCall.args[0];
    let id = object[Object.keys(object)[0]];
    classTDG.insert(...getAttributesHelper(object, className), function(err, result) {
            if (!err) {
                idMap.add(object, id);
            }
        });
}

/**
 * [deleteAdvice description]
 * @param  {[type]} methodCall [description]
 */
function deleteAdvice(methodCall) {
    console.log('deleteAdvice');
    let className = getClassNameHelper(meld.joinpoint().target.name);
    let classTDG = getTDGHelper(className);
    let object = methodCall.args[0];
    let id = object[Object.keys(object)[0]];
    classTDG.delete(id, function(err, result) {
        if (!err) {
            idMap.delete(object, id);
        }
    });
}

/**
 * [updateAdvice description]
 * @param  {[type]} methodCall [description]
 */
function updateAdvice(methodCall) {
    console.log('updateAdvice');
    let className = getClassNameHelper(meld.joinpoint().target.name);
    let classTDG = getTDGHelper(className);
    let object = methodCall.args[0];
    let id = object[Object.keys(object)[0]];
    classTDG.update(...getAttributesHelper(object, className), function(err, result) {
            if (!err) {
                idMap.update(object, id);
            }
        });
}

/**
 * Returns the class name, given a TDG or a Mapper.
 * @param  {string} targetName target class (TDG or Mapper)
 * @return {string} Class name
 */
let getClassNameHelper = function(targetName) {
    let classNames = ['Tablet', 'Monitor', 'Laptop', 'Desktop', 'User', 'Item'];
    for (name of classNames) {
        if (targetName.includes(name)) {
            return name;
        }
    }
};

/**
 * Models
 * @param  {[type]} value     [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
let getAttributesHelper = function(value, className) {
    switch (className) {
        case 'Desktop':
            return [value.model, value.brand, value.processor, value.ram,
                value.storage, value.cores, value.dimensions, value.weight, value.price];
            break;
        case 'Laptop':
            return [value.model, value.brand, value.display, value.processor,
                value.ram, value.storage, value.cores, value.os,
                value.battery, value.camera, value.touch, value.dimensions,
                value.weight, value.price];
            break;
        case 'Monitor':
            return [value.model, value.brand, value.size,
                value.weight, value.price];
            break;
        case 'Tablet':
            return [value.model, value.brand, value.display, value.processor,
                value.ram, value.storage, value.cores, value.os,
                value.battery, value.camera, value.dimensions,
                value.weight, value.price];
            break;
        case 'User':
            return [value.firstname,
                value.lastname, value.address, value.email, value.phone, value.password, value.isadmin, value.sessionid, value.id];
            break;
        case 'Item':
            return [value.serialnumber, value.model, value.islocked];
            break;
        }
};

/**
 * [getTDGHelper description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
let getTDGHelper = function(className) {
    switch (className) {
        case 'Desktop':
            return DesktopTDG;
            break;
        case 'Laptop':
            return LaptopTDG;
            break;
        case 'Monitor':
            return MonitorTDG;
            break;
        case 'Tablet':
            return TabletTDG;
            break;
        case 'Item':
            return ItemTDG;
            break;
        case 'User':
            return UserTDG;
            break;
    }
};

/**
 * [getMapperHelper description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
let getMapperHelper = function(className) {
    switch (className) {
        case 'Desktop':
            return DesktopMapper;
            break;
        case 'Laptop':
            return LaptopMapper;
            break;
        case 'Monitor':
            return MonitorMapper;
            break;
        case 'Tablet':
            return TabletMapper;
            break;
        case 'Item':
            return ItemMapper;
            break;
        case 'User':
            return UserMapper;
            break;
    }
};
