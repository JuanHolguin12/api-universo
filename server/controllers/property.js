const Property = require("../models/property")
const image = require("../utils/image")
const fs = require('fs');
const path = require('path');

async function getProperty(req, res) {
    const { id } = req.params
    Property.findById({ _id: id }, (error, porpertyStorage) => {
        if (error) {
            res.status(400).send({ msg: "La propiedad no existe" })
        } else {
            res.status(200).send(porpertyStorage)
        }
    })
}
function eliminarFotos(fotos) {
    for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const filePath = path.join(__dirname, './uploads', foto);
        const filePath2 = filePath.replace("\\", "/").replace("\controllers", "")
        fs.unlink(filePath2, err => {
            if (err) {
                console.log("Fotos eliminadas");
            } else {
                console.log("Fotos no eliminadas");
            }
        });
    }
}

function saveImage(file) {
    const newPath = `./uploads/houses/${file.filename}.${file.mimetype.split("/")[1]}`
    fs.renameSync(file.path, newPath)
    return newPath
}

async function createProperty(req, res) {
    const property = new Property({ ...req.body, active: true })


    if (req.files.length !== 0) {
        imagenes = image.getFilePath(req.files)
        imagenes.map(img => property.photos.push(img))
    }

    property.save((error, porpertyStorage) => {
        if (error) {
            res.status(400).send({ msg: "Error al crear el inmueble" + error })
        } else {
            req.files.map(saveImage)
            res.status(201).send(porpertyStorage)
        }
    })
}

async function getProperties(req, res) {
    const { active, page = 1, limit = 10 } = req.query
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    if (active === undefined) {
        Property.paginate({}, options, (error, properties) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener propiedades" })
            } else {

                res.status(200).send(properties)
            }
        })
    } else {
        Property.paginate({ active: active }, options, (error, properties) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener propiedades" })
            } else {

                res.status(200).send(properties)
            }
        })
    }
}

async function updateProperty(req, res) {
    const { id } = req.params;
    const propertyData = req.body;
    Property.findByIdAndUpdate({ _id: id }, propertyData, (error) => {
        if (error) {
            res.status(400).send({ msg: "Error al actualizar el propiedad" });
        } else {
            res.status(200).send({ msg: "Actualizacion correcta" });
        }
    });
}



async function deleteProperty(req, res) {
    try {
        const { id } = req.params

        const objetoEliminado = await Property.findByIdAndDelete({ _id: id });

        if (!objetoEliminado) {
            res.status(400).send({ msg: "Error al eliminar propiedad" })
        } else {
            res.status(200).send({ msg: "Popiedad eliminada" })
        }

        // 2. Eliminar las fotos del servidor
        eliminarFotos(objetoEliminado.photos);

        console.log('Objeto eliminado correctamente.');
        /* Property.findByIdAndDelete({ _id: id }, (error) => {
            if (error) {
                res.status(400).send({ msg: "Error al eliminar propiedad" })
            } else {
                res.status(200).send({ msg: "Popiedad eliminada" })
            }
        }) */
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    getProperty,
    createProperty,
    getProperties,
    deleteProperty,
    updateProperty
}