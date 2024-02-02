 const checkUser = (role) => (req, res, next) => {
  try {
    const hRole = req.query.Role
    if(!hRole){
      return res.status(400).json({messeger: "Bạn chưa nhập quyền"})
    }
    if(hRole !== role){
      return res.status(400).json({messeger: "Bạn chưa có quyền"})
    }
    next()
    
  } catch (error) {
    console.log("🚀 ~ checkUser ~ error:", error)
    return res.status(400).json({messeger: "Bạn chưa có quyền", error: error})
  }
 
 }

 module.exports = checkUser