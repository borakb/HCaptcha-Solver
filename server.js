const express = require("express");
const cors = require("cors");
const app = express();

const solveCaptcha = require("./solveCaptcha");
const Comms = new (require("./modules/comms"))();

app.use(cors());
app.use(express.json());

// const awaitMax = (fun, maxTime) => {
//     return new Promise(async (resolve, reject) => {

//         let timeout = null;

//         fun().then(l => {
//             if(timeout) clearTimeout(timeout);
//             return resolve(l);
//         }).catch(err => {
//             if(timeout) clearTimeout(timeout);
//             return reject(err);
//         });

//         timeout = setTimeout(() => { resolve(null) }, maxTime);

//     });
// }

app.post("/zaptcha/solve", async (req, res) => {
    if(!req.body || !req.body.domain || !req.body.sitekey) return res.json({success: false, message: "invalid body"});
    // captcha_type + api_key

    const domain = req.body.domain;
    const sitekey = req.body.sitekey;

    const captcha_solution = await solveCaptcha(domain, sitekey, Comms, 0);
    
	// console.log(captcha_solution);
	
    if(captcha_solution) {
        console.log("Successfully solved captcha.");
        return res.json({success: true, key: captcha_solution});
    }

    return res.json({success: false, message: "failed solve"});

});

app.listen(3068, () => {
    console.log("Server online");
});