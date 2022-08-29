const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const server = http.createServer(app);
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
const _ = require("lodash");
let default_items =[];

// mongoose
// connection
const url="mongodb+srv://admin-RahulKandaswamy:Test123@cluster0.w9ew7ye.mongodb.net/todolistDB"
mongoose.connect(url);

// Schema for todo for today
const todolistSchema = mongoose.Schema({
    item_name : String,
});

// model for todo for today
const todolist_model = new mongoose.model("item",todolistSchema);

// creating items using model for todo for today
const item1 = new todolist_model({
    item_name : "books",
})
const item2 = new todolist_model({
    item_name : "pen",
})
const item3 = new todolist_model({
    item_name : "pencil",
})



// list schema

const listSchema = mongoose.Schema({
    name : String,
    items_l : [todolistSchema],
})

// 

const list_model = mongoose.model("list",listSchema);
// routing

app.get("/",function(req,res)
{
    let currentday = date.getDate();
    todolist_model.find(function(err,items)
    {
        if(err)
        {
            console.log(err);
        }
        else if (items.length===0)
        {
            // insertingMany
            default_items =[item1,item2,item3];

            todolist_model.insertMany(default_items,function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("successfully added default items");
                }
            });
            res.redirect("/");
        }
        else{
        
            res.render("index",{Title : "Today" , item : items});
        };
    })

})
let customList_name;
app.get("/:list_r",function(req,res)
{
    customList_name = req.params.list_r;
    customList_name = _.capitalize(customList_name);
    
    list_model.findOne({name : customList_name},function(err , foundlist){
        if(err){
            console.log(err);
        }
        else{
            
            if(!foundlist)
            {
                    const customList = new list_model({
                    name : req.params.list_r,
                    items_l : [item1,item2,item3],
                })
                customList.save();
                res.redirect("/" + customList_name);
            }
            else{
               res.render("index",{Title : foundlist.name , item :foundlist.items_l});
               
            }
        }
    });
});

app.post("/",function(req,res)
{
    var item_p = req.body.todoitem;
    var btn_p = req.body.route;
    const todo_item = new todolist_model({
        item_name : item_p,
    })
    if(btn_p === "Today")
    {
        todo_item.save();
        res.redirect("/");
    }
    else{
        list_model.findOne({name : btn_p},function(err,foundlist_p)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                
                foundlist_p.items_l.push(todo_item);
                foundlist_p.save();
            }
        });
        res.redirect("/" + btn_p);
    }
    
})

app.post("/delete",function(req,res)
{
    let check_id = req.body.checkbox;
    let check_btn = req.body.list_title;
    if(check_btn === "Today")
    {
        todolist_model.findByIdAndRemove(check_id,function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect("/");
            }
        }) // executes
    }
    else{
        list_model.findOneAndUpdate(
            {name : check_btn},
            {$pull : {items_l : {_id : check_id}}},
            function(err,result)
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.redirect("/"  + check_btn);
                }
            }
        )
    }
   
})
app.get("/about",function(req,res)
{
    res.render("about");
})
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
