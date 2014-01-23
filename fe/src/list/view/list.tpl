<!-- target: list -->

<!-- for: ${list} as ${thing}, ${index} -->
<li data-key="${thing.key}">
    <img src="${thing.image}" />
    ${index}: ${thing.name}
</li>
<!-- /for -->

<!-- target: main -->
<article>

    <ul class="list-group">
        <!-- import: list -->
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
</nav>