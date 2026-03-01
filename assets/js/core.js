(function($){

  /* External links */
  $(document).ready(function() {
    $('a[href]').each(function() {
      if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank' });
    });
    $('a[href^=#][href!=#]').click(function() {
      var target = document.getElementById(this.hash.slice(1));
      if (!target) return;
      var targetOffset = $(target).offset().top;
      $('html,body').animate({scrollTop: targetOffset}, 400);
      return false;
    });
  });

  /* Go to top */
  $(document).ready(function() {
    $("#toTop").hide(), $("#toTop a:first").click(function() {
        $("html,body").animate({
            scrollTop:0
        }, 200);
    });
    var a = parseInt($("body").css("height"));
    $("#toTop a:last").click(function() {
        $("html,body").animate({
            scrollTop:a
        }, 200);
    }), $(window).scroll(function() {
        $(this).scrollTop() > 200 ? $("#toTop").fadeIn() :$("#toTop").fadeOut();
    });
  });

  /* site search */
  $(document).ready(function() {
    var entries = null;
    function htmlEscape(s) {
      return String(s).replace(/[&<>"'\/]/g, function(s) {
        var entityMap = {
          "&": "&amp;",
             "<": "&lt;",
             ">": "&gt;",
             '"': '&quot;',
             "'": '&#39;',
             "/": '&#x2F;'
        };
        return entityMap[s];
        });
    }
    function xmlDateToJavascriptDate(xmlDate) {
      var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+-])([0-9]{2}):([0-9]{2}))?$/;
      var match = xmlDate.match(re);
      if (!match)
        return null;
      var all = match[0];
      var year = match[1];  var month = match[2];  var day = match[3];
      var hour = match[4];  var minute = match[5]; var second = match[6];
      var milli = match[7];
      var z_or_offset = match[8];  var offset_sign = match[9];
      var offset_hour = match[10]; var offset_minute = match[11];
      if (offset_sign) {
        var direction = (offset_sign == "+" ? 1 : -1);
        hour =   parseInt(hour)   + parseInt(offset_hour)   * direction;
        minute = parseInt(minute) + parseInt(offset_minute) * direction;
      }
      month = parseInt(month) - 1;
      var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
      return new Date(utcDate);
    }
    function formatDate(date) {
      return date.getFullYear()+"-"+ (date.getMonth()+1)+ '-' + date.getDate();
    }
    function findEntries(q) {
      var matches = [];
      var rq = new RegExp(q, 'im');
      var rl = /^http:\/\/blog\.javachen\.com\/(.+)$/;
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = $(entry.getElementsByTagName('title')[0]).text();
        var link = $(entry.getElementsByTagName('link')[0]).attr('href');
        //var title_en = rl.exec(link)[1].replace(/-/g, ' ');
        var content = $(entry.getElementsByTagName('content')[0]).text();
        //if (rq.test(title) || rq.test(title_en) || rq.test(content)) {
        if (rq.test(title) || rq.test(content)) {
          var updated = formatDate(xmlDateToJavascriptDate($(entry.getElementsByTagName('updated')[0]).text()));
          matches.push({'title': title, 'link': link, 'date': updated, 'content': content});
        }
      }
      var html = '<h3>Search Result:</h3>';
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        html += '<article class="news-item"><h4><a href="' + match.link + '">' + htmlEscape(match.title) + '</a></h4>';
        html += '<section><p>' + htmlEscape(match.content) + '</p></section>';
        html += '<footer><p>Update: ' + match.date + '</p></footer></article>';
      }
      $('.row').html(html);
      $('#search-loader').hide();
      $('.row').show();
      }
      $('#search-form').submit(function() {
        var query = $('#query').val();
        //$('#query');.blur().attr('disabled', true);
        $('.raw').hide();
        $('#search-loader').show();
        if (entries == null) {
          $.ajax({url: '/atom.xml?r=' + (Math.random() * 99999999999), dataType: 'xml', success: function(data) {
            entries = data.getElementsByTagName('entry');
            findEntries(query);
          }});
        } else {
          findEntries(query);
        }
        $('#query').blur().attr('disabled', false);
        return false;
      });

    });

  /* Theme toggle functionality */
  $(document).ready(function() {
    // Get the theme toggle button and icon
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('svg use');

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Apply initial theme
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        themeIcon.setAttribute('xlink:href', '#icon-sun');
      } else {
        document.documentElement.classList.remove('dark-theme');
        themeIcon.setAttribute('xlink:href', '#icon-moon');
      }
      localStorage.setItem('theme', theme);
      currentTheme = theme;
    }

    // Initial theme application
    applyTheme(currentTheme);

    // Add click event listener for theme toggle
    themeToggle.addEventListener('click', () => {
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  });

  /* TOC 当前位置高亮 */
  $(document).ready(function() {
    if ($('#toc').length && $('article h2, article h3, article h4').length) {
      const headings = $('article h2, article h3, article h4');
      const tocLinks = $('#toc a');

      $(window).scroll(function() {
        let current = '';
        headings.each(function() {
          const top = $(this).offset().top;
          if ($(window).scrollTop() >= top - 100) {
            current = $(this).attr('id');
          }
        });

        tocLinks.removeClass('active');
        if (current) {
          tocLinks.filter('[href="#' + current + '"]').addClass('active');
        }
      });
    }
  });

  /* 隐藏空的 TOC 侧边栏 */
  $(document).ready(function() {
    const $sidebar = $('.post-sidebar');
    if ($sidebar.length) {
      const hasHeadings = $('article h2, article h3, article h4').length > 0;
      if (!hasHeadings) {
        $sidebar.addClass('toc-empty');
      }
    }
  });

  })(jQuery);

  /* 代码块功能增强 */
  $(document).ready(function() {
    $('pre').each(function() {
      const $pre = $(this);
      const $code = $pre.find('code');

      // 获取语言 - 支持多种类名格式
      let language = 'text';
      const codeClass = $code.attr('class') || '';
      const preClass = $pre.attr('class') || '';
      const combinedClass = codeClass + ' ' + preClass;

      // 尝试匹配各种语言类名格式
      const patterns = [
        /language-(\w+)/,
        /highlight-(\w+)/,
        /lang-(\w+)/,
        /(\w+)-code/
      ];

      for (const pattern of patterns) {
        const match = combinedClass.match(pattern);
        if (match) {
          language = match[1];
          break;
        }
      }

      // 如果还是没找到，尝试从 Pygments 的 highlight 类中推断
      if (language === 'text' && combinedClass.includes('highlight')) {
        // Pygments 通常会有 highlight 类，但语言信息可能在父元素或其他地方
        // 这里我们可以设置一个默认值
        language = 'code';
      }

      // 创建包装器
      const $wrapper = $('<div class="code-block"></div>');
      const $header = $('<div class="code-header"></div>');
      const $lang = $('<span class="code-lang"></span>').text(language);
      const $actions = $('<div class="code-actions"></div>');

      // 复制按钮
      const $copy = $('<button class="code-copy" title="复制代码"><svg class="icon"><use xlink:href="#icon-copy"></use></svg></button>');

      // 折叠按钮
      const $collapse = $('<button class="code-collapse" title="折叠/展开"><svg class="icon"><use xlink:href="#icon-chevron-up"></use></svg></button>');

      $actions.append($copy, $collapse);
      $header.append($lang, $actions);
      $pre.wrap($wrapper);
      $pre.before($header);

      // 复制功能
      $copy.click(function() {
        const code = $code.text();
        navigator.clipboard.writeText(code).then(() => {
          $copy.addClass('copied');
          $copy.attr('title', '已复制!');
          setTimeout(() => {
            $copy.removeClass('copied');
            $copy.attr('title', '复制代码');
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
        });
      });

      // 折叠功能
      $collapse.click(function() {
        $pre.toggleClass('collapsed');
        $collapse.toggleClass('collapsed');
        const isCollapsed = $pre.hasClass('collapsed');
        $collapse.attr('title', isCollapsed ? '展开' : '折叠');
      });
    });
  });

  /* 使整个文章卡片可点击 */
  $(document).ready(function() {
    $('.homepage .article-item').click(function(e) {
      // 如果点击的不是链接本身，则跳转到文章
      if (!$(e.target).is('a') && !$(e.target).closest('a').length) {
        const link = $(this).find('.article-title a').attr('href');
        if (link) {
          window.location.href = link;
        }
      }
    });
  });
