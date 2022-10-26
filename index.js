const receiveCaptcha =  require("./api.js");

(async () => {
	
	const cap = await receiveCaptcha("discord.com", "4c672d35-0701-42b2-88c3-78380b0db560")
	console.log(cap)
	
})();