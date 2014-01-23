<!-- target: list -->

<!-- for: ${list} as ${thing}, ${index} -->
<li>${index}: ${thing.name}</li>
<!-- /for -->

<!-- target: main -->
<article>

    <ul class="list-group">
        <!-- for: ${list} as ${thing}, ${index} -->
        <li>${index}: ${thing.name}</li>
        <!-- /for -->
    </ul>
    
    <a class="pager" role="button" data-page="0" >
        查看更多 <!-- ${page} -->
    </a>
    
</article>

<!-- target: nav -->
<nav data-viewport-bar="nav" data-name="list" class="list-nav">
    <h1 class="title">
        标题
    </h1>
    <a class="prev" href="">返回</a>
</nav>