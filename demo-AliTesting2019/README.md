# 阿里 2018春招 前端实习在线测评题目

实现一个方法genCssSelector，可以根据一个给定的元素生成一个CSS选择器，通过这个选择器可以快速定位到这个元素（document.querySelector(A)）

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        <div id="page">
            <div class="content main">
                <div class="refer">
                    <ul>
                        <li></li>
                        <li></li>
                        ...
                    </ul>
                 </div>
            </div>
        </div>
    </body>
    </html>
根据上述HTML结构，完善如下JavaScript代码中的“your code here”部分，使得click事件中的注释要求符合预期：

    var genCssSelector = function(){
        // your code here
    }
    document.addEventListener('click', function(e){
        //点击li时，返回：html body #page .content.main .refer ul li
        console.log(genCssSelector(e.target));
    })

**解答**

    <script type="text/javascript">
            var genCssSelector = function(element){
                var arr = [];//arr存放冒泡链上涉及的DOM元素
                var cssSelectorArr = [];
                arr.push(element);//事件接收最开始的具体元素
                if (element == document.getElementsByTagName("html")[0]) {
                    console.log("请点击具体的DOM元素");
                } else {
                        while (element.parentNode.tagName !== "HTML") {
                            arr.push(element.parentNode);
                            element = element.parentNode;
                        }
                    }
                arr.push(element.parentNode);//冒泡到最顶层的html元素，即文档的根元素
                //此时arr中装的是一个个的DOM对象，要将其CSS选择器特性提取出来
                // 从最高层的DOM元素开始提取CSS选择器特性，即有id 或class属性的提取，没有的提取标签名字
                var len = arr.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (arr[i].getAttribute("id")) {
                        // 如果DOM元素有id属性,获取id属性的值
                        var id = arr[i].getAttribute("id");              
                        // 将id属性的值作变形，即字符串拼接，变成类似样式 #page 
                        var idTrans = "#" + id;
                        cssSelectorArr.push(idTrans);
                    } 
                    if ( arr[i].getAttribute("class")) {
                        // 如果DOM元素有class属性,获取class属性的值
                        var classNames = arr[i].getAttribute("class");
                        // 将class属性的值作变形，即字符串拼接，变成类似样式  .content.main
                        var classNamesTrans = "." + classNames.split(" ").join(".");
                        cssSelectorArr.push(classNamesTrans);
                 
                    }
                    // DOM对象既没有id属性也没有class属性,提取标签名字
                    else if (!arr[i].getAttribute("id") && !arr[i].getAttribute("class")) {
                        cssSelectorArr.push(arr[i].tagName.toLocaleLowerCase());
                    }
                }
                return cssSelectorArr;
            }
            // 采用冒泡机制，一层层向上捕获，直到html
            document.addEventListener('click', function(e){
            //点击li时，返回：html body #page .content.main .refer ul li
            //console.log(e.target);
            console.log(genCssSelector(e.target));
            //google返回 ["html", "body", "#page", ".content.main", ".refer", "ul", "li"]
            })
        </script>

**实现思路**

重点应该是考察DOM事件的冒泡机制，从最底层的元素开始，一直冒泡到最顶层的html元素，获取了这些DOM对象之后，之后就是操作DOM对象的属性了，即id和class属性，若有这两个属性，则返回并写成css选择器的形式，若无这两个属性，则写出DOM元素的标签名字作为css选择器。操作DOM元素属性并转换形式涉及字符串的操作。

**反思**

当时30分钟，读完题倒是想到事件冒泡机制获取DOM元素了，但很多DOM操作方式都忘记了，现各种查就慌神了，而且后面自己实现的时候感觉时间花的最多的地方不是实现思路，反而是一些语法和具体的DOM操作方法，还得加强这方面的熟练。
