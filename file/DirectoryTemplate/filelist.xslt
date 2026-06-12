<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" doctype-system="about:legacy-compat" />
  
  <xsl:template match="/">
    <html lang="zh-cmn-Hans">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"/>
        <meta name="renderer" content="webkit"/>
        <meta name="force-rendering" content="webkit"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <link rel="stylesheet" href="/css/mdui.min.css"/>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        <title>FileCenter</title>
        <style type="text/css">
          body {background-color: #f1f3f5;}
          .mdui-card { border-radius: 18px; }
          .mdui-btn-block { border-radius: 12px; }
          .mdui-btn { border-radius: 12px; }
          .mdui-menu-open { border-radius: 12px; box-shadow: 0 10px 20px 0 rgba(0,0,0,.22); }
          .mdui-menu-closing { border-radius: 12px; box-shadow: 0 10px 20px 0 rgba(0,0,0,.22); }
          .mdui-tooltip { border-radius: 6px; }
          .mdui-table-fluid { border-radius: 12px; border: none; }
          .mdui-table tbody:last-child tr:last-child td { border-bottom: none; }
          .mdui-panel-item { border-radius: 12px; }
        
          @media (prefers-color-scheme: dark) {
            .mdui-btn-icon svg use { fill: white !important; }
            .mdui-table { background-color: #424242 !important; }
            .mdui-table-fluid { border-top: none !important; border-left: none !important; border-right: none !important; border-bottom: none !important; }
            .mdui-color-blue-grey-50 { background-color: #455A64 !important; }
            .mdui-color-grey-200 { background-color: #616161 !important; }
            .text-color-changing { color: #ffffff !important; }
          }
        </style>
      </head>
      <body class="mdui-loaded mdui-theme-layout-auto">
        <div class="mdui-appbar mdui-shadow-0">
          <div class="mdui-toolbar">
            <a href="#" onClick="javascript :history.back(-1);" class="mdui-btn mdui-btn-icon" mdui-tooltip="{{content: 'Back', delay: 500}}"><i class="mdui-icon material-icons">&#xe5c4;</i></a>
            <a href="/" class="mdui-typo-headline" style="font-weight: 500;">FileCenter</a>
            <a href="/" class="mdui-typo-title" style="font-weight: 500;"><small>List<span class=" mdui-hidden-xs" > of Files</span></small></a>
            <div class="mdui-toolbar-spacer"></div>
            <button class="mdui-btn mdui-btn-icon" mdui-menu="{{target: '#more'}}" mdui-tooltip="{{content: 'More', delay: 500}}">
              <i class="mdui-icon material-icons">&#xe5d4;</i>
            </button>
            <ul class="mdui-menu" id="more">
              <li class="mdui-menu-item">
                <a href="/about">About</a>
              </li>
              <div class="mdui-divider"></div>
              <li class="mdui-subheader" style="line-height: 20px; height: 20px;"><small>Nginx Theme by Nick_DL</small></li>
            </ul>
          </div>
        </div>
      
        <div class="mdui-container">
          <div class="mdui-row">
            <div class="mdui-col-md-10 mdui-col-offset-md-1 mdui-p-t-3">
              <p class="mdui-typo-title" id="breadcrumb"></p>
            </div>
            <div class="mdui-col-md-10 mdui-col-offset-md-1">
              <div class="mdui-card mdui-shadow-0 mdui-text-center" style="overflow-x: auto;">
                <table class="mdui-table mdui-table-fluid mdui-text-left">
                  <thead>
                    <tr>
                      <th style="padding-left: 18px;">
                        <a href="../" class="mdui-btn mdui-btn-icon" mdui-tooltip="{{content: 'To Parent Directory', delay: 500}}"><i class="mdui-icon material-icons">&#xe5d8;</i></a>
                      </th>
                      <th>Filename</th>
                      <th>Size</th>
                      <th>Date &amp; Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  
                  <xsl:for-each select="list/directory">
                    <tbody>
                      <tr>
                        <td><i class="mdui-icon material-icons mdui-text-color-theme-secondary">&#xe2c7;</i></td>
                        <td>
                          <a href="{.}/" style="text-decoration: none;" class="mdui-text-color-theme-text">
                            <xsl:value-of select="." />
                          </a>
                        </td>
                        <td>-</td>
                        <td><xsl:value-of select="@mtime" /></td>
                        <td>
                          <a href="{.}/" class="mdui-btn mdui-btn-dense mdui-btn-icon mdui-color-blue-grey-50" mdui-tooltip="{{content: 'Open', delay: 500}}">
                            <i class="mdui-icon material-icons text-color-changing">&#xe89e;</i>
                          </a>
                          <button class="mdui-btn mdui-btn-dense mdui-btn-icon mdui-color-blue-grey-50 copy-link-btn" data-link="{.}/" mdui-tooltip="{{content: 'Copy link', delay: 500}}">
                            <i class="mdui-icon material-icons text-color-changing">&#xe157;</i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </xsl:for-each>

                  <xsl:for-each select="list/file">
                    <tbody>
                      <tr>
                        <td><i class="mdui-icon material-icons mdui-text-color-theme-secondary">&#xe24d;</i></td>
                        <td>
                          <a href="{.}" style="text-decoration: none;" class="mdui-text-color-theme-text">
                            <xsl:value-of select="." />
                          </a>
                        </td>
                        <td><xsl:value-of select="@size" /></td>
                        <td><xsl:value-of select="@mtime" /></td>
                        <td>
                          <a href="{.}" class="mdui-btn mdui-btn-dense mdui-btn-icon mdui-color-blue-grey-50" mdui-tooltip="{{content: 'Open', delay: 500}}">
                            <i class="mdui-icon material-icons text-color-changing">&#xe89e;</i>
                          </a>
                          <button class="mdui-btn mdui-btn-dense mdui-btn-icon mdui-color-blue-grey-50 copy-link-btn" data-link="{.}" mdui-tooltip="{{content: 'Copy link', delay: 500}}">
                            <i class="mdui-icon material-icons text-color-changing">&#xe157;</i>
                          </button>
                          <a href="{.}" class="mdui-btn mdui-btn-dense mdui-btn-icon mdui-color-blue-grey-50" download="{.}" mdui-tooltip="{{content: 'Download', delay: 500}}">
                            <i class="mdui-icon material-icons text-color-changing">&#xe2c4;</i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </xsl:for-each>
                  
                </table>
              </div>
              <p></p>
            </div>
          </div>
        </div>
        <p></p>
        <div class="footer-nav mdui-color-grey-200 text-color-changing"> 
          <div class="mdui-container"> 
            <div class="mdui-row"> 
              <div class="mdui-col-sm-12">  
                <div class="intro mdui-typo"> 
                  <p></p> 
                  <p></p>
                  <p><span id="noticeInfo"></span></p>
                  <p><span id="copyrightInfo">Loading</span></p>
                  <p></p>
                </div> 
              </div> 
            </div> 
          </div> 
        </div>
        <script src="/js/mdui.min.js"></script>
        <!--[if IE]>
          <script src="/js/json3.min.js"></script>
        <![endif]-->
        <script src="/js/main_ie.js"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            // Dynamic Size and Date Formatting
            var rows = document.querySelectorAll('.mdui-table tbody tr');
            rows.forEach(function (row) {
              var sizeTd = row.cells[2];
              var dateTd = row.cells[3];
              
              if (sizeTd &amp;&amp; sizeTd.textContent.trim() !== '-') {
                var bytesStr = sizeTd.textContent.trim();
                if (/^\d+$/.test(bytesStr)) {
                  var bytes = parseInt(bytesStr, 10);
                  if (bytes === 0) {
                    sizeTd.textContent = '0 B';
                  } else if (bytes &lt; 1024) {
                    sizeTd.textContent = bytes + ' B';
                  } else {
                    var k = 1024;
                    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                    var i = Math.floor(Math.log(bytes) / Math.log(k));
                    sizeTd.textContent = (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
                  }
                }
              }
              
              if (dateTd &amp;&amp; dateTd.textContent.trim() !== '-') {
                var dateStr = dateTd.textContent.trim();
                if (dateStr.indexOf('T') !== -1) {
                  dateTd.textContent = dateStr.replace('T', ' ').replace('Z', '');
                }
              }
            });

            // Dynamic Breadcrumb Generation
            var breadcrumb = document.getElementById('breadcrumb');
            if (breadcrumb) {
              var path = decodeURIComponent(window.location.pathname);
              var parts = path.split('/').filter(Boolean);
              var currentPath = '/';
              
              var rootA = document.createElement('a');
              rootA.href = '/';
              rootA.className = 'mdui-btn';
              rootA.style.cssText = 'color: #0A59F7; font-weight: 700; padding: 0 4px; font-size: 20px; text-transform: none; min-width: 4px;';
              rootA.textContent = window.location.hostname || 'Home';
              breadcrumb.appendChild(rootA);
              
              var span = document.createElement('span');
              span.className = 'mdui-text-color-grey';
              span.textContent = ' / ';
              breadcrumb.appendChild(span);

              parts.forEach(function(part, index) {
                currentPath += part + '/';
                var a = document.createElement('a');
                a.href = currentPath;
                a.className = 'mdui-btn';
                a.style.cssText = 'font-weight: 700; padding: 0 4px; font-size: 20px; text-transform: none; min-width: 4px;';
                a.textContent = part;
                breadcrumb.appendChild(a);
                
                var spanSeparator = document.createElement('span');
                spanSeparator.className = 'mdui-text-color-grey';
                spanSeparator.textContent = ' / ';
                breadcrumb.appendChild(spanSeparator);
              });
            }

            var tableContainer = document.querySelector('.mdui-card[style*="overflow-x: auto"]');
            if (tableContainer) {
              tableContainer.addEventListener('wheel', function (e) {
                if (tableContainer.scrollWidth > tableContainer.clientWidth) {
                  if (e.deltaY !== 0) {
                    e.preventDefault();
                    tableContainer.scrollLeft += e.deltaY * 0.5;
                  }
                }
              }, { passive: false });
            }

            var copyBtns = document.querySelectorAll('.copy-link-btn');
            copyBtns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                var link = this.getAttribute('data-link');
                var fullUrl = new URL(link, window.location.href).href;
                
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(fullUrl).then(function () {
                    mdui.snackbar({ message: 'Link copied!', position: 'right-top' });
                  });
                } else {
                  var tempInput = document.createElement('input');
                  tempInput.value = fullUrl;
                  document.body.appendChild(tempInput);
                  tempInput.select();
                  document.execCommand('copy');
                  document.body.removeChild(tempInput);
                  mdui.snackbar({ message: 'Link copied!', position: 'right-top' });
                }
              });
            });
          });
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
