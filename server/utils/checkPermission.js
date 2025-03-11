const UnauthorizedError = require("../errors/UnauthorizeError")

const checkPermission = (requestUser,resourceUserId) => {
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return 
    throw new UnauthorizedError('You are not authorized to access this route')
}



module.exports = checkPermission