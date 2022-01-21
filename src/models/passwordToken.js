var {v4:uuidv4} = require('uuid');
var UserPass = require('./User');
var knex = require('../database/connection');


class passwordToken {
    
    async create(email) {
     var user = await UserPass.findByEmail(email);
     if(user != undefined) {
        try {
            var token = uuidv4();       
            await knex.insert({
                user_id: user.id,
                used: 0,
                token: token
            }).table('password_tokens')
            return {status: true, token: token}
        } catch (err) {
            console.log(err);
            return { status: false, err: err}
        }
     }else{
        return {status: false, err: "Email does not exist in our database."}
        }
    }

    async validateToken(token) {
        try {
            var result = await knex.select().where({token: token}).table('password_tokens');
            if(result.length > 0) {
                var tk = result[0];
                if(tk.used) {
                    return {status: false};
                }else{
                    return {status: true, token: tk};    
                }
            }else{
                return {status: false}
            }  
        }catch (err) {
            console.log(err);
            return {status: false};
        }
    }

    async setIsedToken(token) {
     await knex.update({used: 1}).andWhere({token: token}).table("password_tokens")    
    }
}

module.exports = new passwordToken();