const request = require("request");

const receiveCaptcha = async (domain, sitekey) => {
    return new Promise((resolve, reject) => {

        request({
            method: "POST",
            url: "http://localhost:3068/zaptcha/solve",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domain: domain,
                sitekey: sitekey
            }),
            timeout: 30000
        }, (error, response) => {
            if(error) return reject(error); //"ESOCKETTIMEDOUT"

            const body = JSON.parse(response.body);

            if(!body) return resolve(false);

            if(!body.success || !body.key) return resolve(false);

            return resolve(body.key);
        });

    });
}

module.exports = receiveCaptcha;