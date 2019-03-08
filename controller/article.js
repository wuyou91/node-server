const formidable = require('formidable')
const articleModel = require('../mongodb/models/article.js')
const util = require('../util')

module.exports = {
  async add (req, res) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 0,
					message: '表单信息错误'
        })
        return
      }
      if(!fields.html || fields.html === ''){
        res.send({
          status: 0,
					message: '请勿提交无内容的文章'
        })
        return
      }
      const article_index = await util.getId('article_id')
      try {
        await articleModel.create({
          ...fields,
          create_time: new Date(),
          id: util.PrefixInteger(article_index, 6)
        })
        res.send({
          status: 1,
          message: '文章提交成功'
        })
      } catch (error) {
        res.send({
          status: 0,
          message: '写入文章出现错误'
        })
        throw Error(error)
      }
    })
  },
  async delete(req, res) {
    if(req.query.id){
      try{
        await articleModel.deleteOne({ id: req.query.id});
        res.send({
          status:1,
          message: '文章删除成功'
        })
      }catch(err){
        res.send({
          status:0,
          message: '删除出现错误'
        })
        throw Error(err)
      }  
    }else{
      res.send({
        status:0,
        message: '未获取到文章id，请重新操作'
      })
    }
  },
  async update (req, res) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      const id = fields.article_id
      const content = fields.content
      if(!id){
        res.send({
          status: 0,
          message: '没有文章id'
        })
      }
      try {
        await articleModel.update({id:id},content)
        res.send({
          status: 1,
          message: '文章更新成功'
        })      
      } catch (err) {
        res.send({
          status: 0,
          message: '更新失败'
        }) 
        throw Error(err)     
      }
    })
  }
}