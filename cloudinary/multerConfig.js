import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// storing the form data sent by the browser in a temporary folder 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // storing the file in a temporary folder "uploads"
        cb(null, path.resolve(__dirname, 'uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// checking the incoming file and seeing if it's acceptable

const fileFilter = (req, file, cb) => {
    // using RegEx to set the file types
    const fileTypes = /jpeg|jpg|png/
    
    // checking if the extension on the file matches with the defined file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if(extname) {
        return cb(null, true)
    } else {
        cb('Error: Only images are allowed')
    }
}

// creating the upload middleware and saving the file and file location in it
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})