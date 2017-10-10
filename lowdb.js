const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')

const adapter = new FileSync('db.json')//会修改 db.json
// const adapter = new FileSync('db.json',{//不会修改 db.json
//     defaultValue: { posts: [], user: {} },
//     serialize: (array) => toYamlString(array),
//     deserialize: (string) => fromYamlString(string)
// })
const adapter = new FileSync('db.json',{
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
})
const db = low(adapter)

//为空的 db.json 设置一些默认的东西
db.defaults({ posts: [], user: {} })
  .write()

//添加一个post
// db.get('posts')
//   .push({ id: 1, title: 'lowdb is awesome' })
//   .write()

//设置一个user的属性name
// db.set('user.name', 'typicode')
//   .write()

//获取
// let a = (db.get('posts')
//   .value())
// console.log(a)

// db.set('posts[0].title','3')
//   .write()

// console.log(db.get('user').value())

//db._ 允许你添加自己的实用的方法或者第三方组合属性像 underscore-contrib or lodash-id.
// db._.mixin({
//     second: function(array) {
//         return array[1]
//     }
// })

// console.log(db.get('posts').second().value())

//db.getState() 返回 database 的状态
console.log(db.getState()) //就是 db

//db.setState(newState) 替换 database 的状态 ( 文件未修改 )
// const newState = { newPosts: 1, newUser: 'leihao' } 
// db.setState(newState)
// console.log(db.getState())

let a = shortid.generate()
console.log(a)











