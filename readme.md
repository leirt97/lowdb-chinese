# lowdb
一个灵活存取 json 格式数据的包  参考于[lowdb](https://github.com/typicode/lowdb#install)
# 使用
## npm
```
npm install lowdb --save -dev
```
## demo
```
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')//会修改 db.json
const db = low(adapter)

//为空的 db.json 设置一些默认的东西
db.defaults({ posts: [], user: {} })
  .write()

//添加一个post
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome' })
  .write()

//设置一个user的属性name
db.set('user.name', 'typicode')
  .write()

//获取
let a = (db.get('posts')
  .value())
console.log(a)

db.set('posts[0].title','3')
  .write()

console.log(db.get('user').value())

//db.getState() 返回 database 的状态
console.log(db.getState()) //就是 db

//db.setState(newState) 替换 database 的状态 ( 文件未修改 )
const newState = { newPosts: 1, newUser: 'leihao' } 
db.setState(newState)
console.log(db.getState())
```
# API
### low(adapter)
返回一个带有附加属性和函数的lodash链。
### db.[...].write()
### db.[...].value()
`write()`就是`value()`和`db.write()`写在一行的语法。    
从另一个方面来说，value()就只是.value()，并且应该被用来执行一个不会改变数据库状态的链。
```
db.set('user.name', 'typicode')
  .write()

// 相当于
db.set('user.name', 'typicode')
  .value()

db.write()
```
### db._
允许你添加自己的实用的方法或者第三方组合属性像underscore-contrib or lodash-id。
```
db._.mixin({
    second: function(array) {
        return array[1]
    }
})

console.log(db.get('posts').second().value())
```
### db.getState()
返回 database 的状态
```
console.log(db.getState()) //就是 db
```
###db.setState(newState)
替换 database 的状态 ( 文件未修改 )
```
const newState = { newPosts: 1, newUser: 'leihao' } 
db.setState(newState)
console.log(db.getState())
```
### db.write()
使用 `adapter.write` 维护（写入）数据库（取决于adapter，可能返回一个 promise）。
```
// 通过 lowdb/adapters/FileSync(同步)
db.write()
console.log('State has been saved')

// 通过 lowdb/adapters/FileAsync(异步)
db.write()
  .then(() => console.log('State has been saved'))
```
### db.read()
使用 storage.read 选项来读取源文件（取决于adapter，可能返回一个promise）
```
// 通过 lowdb/FileSync （同步）
db.read()
console.log('State has been updated')

// 通过 lowdb/FileAsync （异步）
db.write()
  .then(() => console.log('State has been updated'))
```
# Adapters API
请注意，这只适用于与Lowdb捆绑的适配器。第三方适配器可能有不同的选项。   
为了方便起见，文件ync、FileAsync和LocalBrowser接受以下选项
* `defaultValue` 如果文件不存在，那么这个值将被用来设置初始状态(default: {})
* `serialize/deserialize` 在 writing 之前 reading 之后使用的方法(default: `JSON.stringify` and `JSON.parse` )
```
const adapter = new FileSync('array.yaml', {
  defaultValue: [],
  serialize: (array) => toYamlString(array),
  deserialize: (string) => fromYamlString(string)
})
```
# 指南
## 如何查询
使用lowdb，您可以访问整个lodash API，因此有许多方法可以查询和操作数据。这里有几个例子可以让你开始。   
请注意，数据是通过引用返回的，这意味着对返回对象的修改可能会改变数据库。为了避免这种行为，您需要使用.cloneDeep()。   
另外，方法的执行是惰性的，也就是说，执行被推迟到.value()或.write()被调用。
### Example
检查 posts 是否存在
```
db.has('posts')
  .value()
```
设置 posts
```
db.set('posts', [])
  .write()
```
将 posts 里面前五个 进行排序
```
db.get('posts')
  .filter({published: true})
  .sortBy('views')
  .take(5)
  .value()
```
得到 posts 的所有标题
```
db.get('posts')
  .map('title')
  .value()
```
获取到 psots 的个数
```
db.get('posts')
  .size()
  .value()
```
获取到 posts 里面第一个的标题
```
db.get('posts[0].title')
  .value()
```
更新 posts
```
db.get('posts')
  .find({ title: 'low!' })
  .assign({ title: 'hi!'})
  .write()
```
移除 posts
```
db.get('posts')
  .remove({ title: 'low!' })
  .write()
```
移除一个属性
```
db.unset('user.name')
  .write()
```
获得一个深度克隆的 posts 
```
db.get('posts')
  .cloneDeep()
  .value()
```
## 怎样加密数据
`FileSync`, `FileAsync` and `LocalStorage`接受自定义`serialize` 和`deserialize` 函数。您可以使用它们来添加加密逻辑。
```
const adapter = new FileSync('db.json', {
  serialize: (data) => encrypt(JSON.stringify(data))
  deserialize: (data) => JSON.parse(decrypt(data))
})
```
# 限制
Lowdb是一种在不设置数据库服务器的情况下存储数据的方便方法。它的速度足够快且安全，可以作为嵌入式数据库使用。   
但是，如果您追求的是高性能和可伸缩性，而不是简单性，那么您应该坚持使用MongoDB这样的传统数据库。