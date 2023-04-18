const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
// var items = [];

mongoose.connect("mongodb://127.0.0.1:27017/to-do-listDB",{useNewUrlParser : true});

const itemSchema = {
    name : String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist" 
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- hit this to delete an item "
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("successfully saved the default items to DB");
//     }
// });

async function getItems(){
    const Items = await Item.find({});
    return Items;
      
}

app.get("/",function(req,res){ 
    getItems().then(function(FoundItems){
        if(FoundItems.length === 0){
            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("Successfully saved defult items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
            res.redirect("/");
        }

        res.render("list", {kindOfDay: "Today",newListItems: FoundItems});
    });
    // res.render("list", {listTitle: "Today",newListItems: FoundItems});

    // res.render("list",{kindOfDay :date.getDate(), newListItems: items});
});

// app.post("/",function(req,res){
//     const itemName = req.body.newItem ;
    
//     const item = new Item({
//         name: itemName
//     });

//     item.save();

//     res.redirect("/");
// })

// app.post("/delete",function(req, res){
//     const checkItemId = req.body.checkbox;
//     Item.findByIdAndRemove(checkItemId,function(err,docs){
//             if(err){
//                 console.log(err)
//             }
//             else{
//                 console.log("success");
//             }
//     })
// });
// let workItems = [];
app.get("/work",function(req,res){
    res.render("list",{kindOfDay:"Work Items", newListItems: workItems});
});

app.post("/work",function(req,res){
    let item = req.bodynewItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000,function(){
    console.log("server is active on port 3000");
})

// app.get('/url', function(req,res){
//     res.render('filename')
// })

app.post('/', function(req, res){
    const id = req.body.newItem;
    const item = new Item({
        name:id
    })
    item.save();
    res.redirect('/');
    
})

app.post('/delete', async function(req, res){
    const id = req.body.checkbox;
    // console.log(id);
    await Item.deleteOne({_id: id}).then(()=>{
        console.log('Item deleted successfully !');
    })
    res.redirect('/');
})
