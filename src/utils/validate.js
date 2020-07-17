'use strict';
const validatePassword = (rule, value, callback) => {
    if (!(/^[^\s]*$/.test(value))) {
        callback(new Error('密码不能有空格'));
    }
    callback();
};
const validateUsername = (rule, value, callback) => {
    if (!(/^[^\s]*$/.test(value))) {
        callback(new Error('用户名不能有空格'));
    }
    callback();
};

const validateEmail = (rule, value, callback) => {
    if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value))) {
        callback(new Error('请输入正确的邮箱'));
    }
    callback();
};
export {
    validatePassword,
    validateUsername,
    validateEmail,
}
