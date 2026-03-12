<template><div><h1 id="https" tabindex="-1"><a class="header-anchor" href="#https"><span>HTTPS</span></a></h1>
<h2 id="第一层-http-的问题" tabindex="-1"><a class="header-anchor" href="#第一层-http-的问题"><span>第一层：HTTP 的问题</span></a></h2>
<p><strong>问题</strong>：HTTP 是明文传输，数据在网络上以明文形式传输，任何人都可以读取。</p>
<Mermaid code="eJyNkM9OwkAQh+88xR4xkXjnQGL0oAeMibxAQzamUQFL9dyqBTHUolTiH2JAQ0KQtGqMBIv6MHam5eQruLCuxODBvewm+5v5vpk83d6hmTRdlKV1RdqKEHZykqLKaTknZVSysClTdkl5As4NHvaCO3cqM6+qUnqDKqMU2h4UvVAzSDS5nErOTIXXqLL7Ha2bcNSEi3ZkHFrJqpRkR3+cOcuTcbKUSq0SPD/GWtEfNMK36uegjGf3aDrglMFo4+XTsP7Im/DSWCIhnOIErJOhpoduDx/2SJT3iZPAbrNpoGLOgVsIGjoXnThM6n8mAsv1vVboemDVsKRhvcQtxpUiz9DCO3ztMrYAs+rAbaLdh4IBTp/zeDT2yzd8t+HqGqomvNjCl4P+7Rh09qHS/dB0TmQPf9AZao2/fBmbL00ICzJrhdYpGC3Un/HA8r3b8Zq+ACa1EKc="></Mermaid><blockquote>
<p><strong>问题总结</strong>：明文传输导致数据完全暴露，攻击者可以窃听、篡改、伪造数据。</p>
</blockquote>
<h2 id="第二层-对称加密解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第二层-对称加密解决了什么问题"><span>第二层：对称加密解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用对称加密加密数据，客户端和服务器共享密钥 K。</p>
<p><strong>解决了</strong>：明文传输问题。即使被截获，攻击者没有密钥 K，无法解密。</p>
<Mermaid code="eJyFkc1OwkAUhfc8xSw1gRdwQWLUFYkbn6AhE9OogKW6Nio/Egv+FERtEDFIg6TtSmLaysv0TttVX8G2Y7WFiLOZm8x3cs6cW8aHR7iQx5sss8sxBynknxLD8WyeLTEFHm3ss9i/mDICZUDqU/tNXWDWeZ7J72EuoIioQ013TioL1A7mjr8ZSYDGM9zLqRDaLvIYFYM3apam5BqyzJktyqB+2CMNGn1QqyiH6EDaGhEUqqeqTDYb6eD11DLboFxARQZJg3oVWte+yL0ZopxnPC13pSAVuXeKO+jO2UTfDY1ITyLdJunULKPvfN5GLnMWv5Kffkh97DSnCT6iYl9xzEkse0jRp0wiiDMT4bEXrwZtreTSiM6r/6cJe6YmyBm9+LNnXFq6YJ+/Q0u19KE9PoOrSTKmH4GWEuWMb+XPfklHo7V6xsOSTQV7+gLKLj7x"></Mermaid><blockquote>
<p><strong>新问题</strong>：密钥 K 如何安全地分发给客户端和服务器？如果通过网络明文传输 K，攻击者可以截获 K，加密失效。</p>
</blockquote>
<h2 id="第三层-非对称加密解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第三层-非对称加密解决了什么问题"><span>第三层：非对称加密解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用非对称加密解决密钥分发问题。服务器生成公钥 K_pub（公开）和私钥 K_priv（保密）。</p>
<p><strong>解决了</strong>：密钥分发问题。即使攻击者截获了加密的对称密钥，没有私钥 K_priv 也无法解密。</p>
<Mermaid code="eJyNk0tPo1AYhvf9FWc1qUnnD3RhMpmZxWTibGb2E2yIIWpbAV3jDan24qU3m2qtRtuoKY0utBbsn+E7wKp/wQMHBLRe2ACH9/2+53vPQWCXltl0iv3BMXM8sxhD5MoyvMiluCyTFtH3BY4lN0ZA0DvFyp15pb7SfBNFJjXP8o4Kl4ewNbSkTRSf+fVvZuqV+C/Lr3jSZgG223DYjbmiPxmRRRnnG+2ZoMokMvSRWe7aR8egDsxOH7ZPQJWtzhnIt+TB3j8HRYbSHq1CTV+np323WW5hZRc2r4kQ/f6fXZ5FX5DZWfVeeW4l6qPNk4hUtKXViC+O60Vc3aIzBbj++MlgeGPQgpJqDM+xcmkV76ifAtL6oUYeIJ3NnYfIBVYQuEw66ggakTw8JppG4Eiin3H3SyJY+wQw5TR0GddO8G3FSVeVx5qCb9q4mYvENdZybj2/SihrS78msb1JMGFvupHSiPYlJPBYC6Xw/vmAUh5XB2axD82uva4T3sA61vKgSdDZCZ8dW2oYo3Y0W7+Yw+55EwhX+rjQewHv71tECQcFeChPvSSdlPSkgMPAuQ/GxdW+XevZp/Wx1oCLNUOvmO2eMTryDgSuq88/ltnYIAFYUt64LzjrPoO73oo9AQMY2NM="></Mermaid><blockquote>
<p><strong>新问题</strong>：如何确保客户端拿到的公钥 K_pub 确实是服务器的，而不是攻击者伪造的？攻击者可以伪装成服务器，发送自己的公钥 K_attacker_pub，中间人攻击仍然存在。</p>
</blockquote>
<h2 id="第四层-数字证书解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第四层-数字证书解决了什么问题"><span>第四层：数字证书解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用数字证书验证服务器身份。CA（证书颁发机构）用私钥对服务器信息（域名、公钥等）签名，生成证书。</p>
<p><strong>解决了</strong>：身份验证问题。攻击者无法伪造证书（没有 CA 的私钥），无法伪装成服务器。</p>
<Mermaid code="eJx9VMtu2kAU3fMVs6qIRH+ARSREu6iqdNPuI4qsymoL1DhZG6U0JOHVFILaEiBNKRYkMVUqIV7hY8odj1f8Qse++BXTeGNr5pxzz71zxlnhw56QSgpPxMQbKfE+RPiTSUiymBQziZRM4u9Egb8SWQI3P2hhpA+0ACYmy4nkW0EyUbQ2hcMpU/IkvPPs1c5WAPxSkPbX0GYJji/gqxosGjP3mZZbjn/R5oS2PpJwPLYVsoAv0rJA0qYGeougYpQs5wu9ptL6EK4byDX6Rf7h1GGTwXI6RxUkPd7ettl6rU0LVchfGadd8nw3ay3vZvZek0dE7+X8q5K471eJx0yFW6aNsPJqVoBiHqoDaLehWvqr5LySq9mRRY/HHKpqNo119Os7TkE/qEbigiS7DNsyW9Tge8sLuWfKmk+UQOWzoeQ8OMedr1HblTtg+2Cj7rHC8Jxp9eWsbygdVLQ4NjJQ1YvkZWmjQ2/rhvKNLQ6tjq1e8ZycqVgCHqX1dPBsEIuCyN6YCh4HT2Ukwc/f7E93NSvSk1N9es4WLVru4swCNZGBRk1GpQqVM9+4/ufVipE21ntD0D7ZsclmxXTKz3CDp/rzBscdznRpUfI07AVE3C28XhuyrG6KLGG9S67MyiO4a3hsPXytoFKkZ2O9PISmahzMafPIpfLJwEyB3sm6Ycs5H9pycbG5WezE4kYIv6q0dHOvB3uQPiR8KcGkFvgBbMgnBsyfuqKzyC7z/HScH4KzpfcPoHqFfkL/AEZharE="></Mermaid><blockquote>
<p><strong>完整方案</strong>：</p>
<ol>
<li>数字证书验证服务器身份 → 确认服务器公钥的真实性</li>
<li>用服务器公钥加密对称密钥 → 安全地交换对称密钥</li>
<li>用对称密钥加密数据 → 高效地加密传输</li>
</ol>
</blockquote>
<h2 id="补充-charles-抓-https-包的原理" tabindex="-1"><a class="header-anchor" href="#补充-charles-抓-https-包的原理"><span>补充：Charles 抓 HTTPS 包的原理</span></a></h2>
<p>Charles 等抓包工具能够抓取 HTTPS 数据的关键在于：<strong>客户端信任了 Charles 的 CA 证书</strong>。</p>
<h3 id="charles-抓-https-包的流程" tabindex="-1"><a class="header-anchor" href="#charles-抓-https-包的流程"><span>Charles 抓 HTTPS 包的流程</span></a></h3>
<Mermaid code="eJytVF1vEkEUfe+vmEcba7G8aIiSaGtiYmJM7Huz4MaSVEAW5FUaKZTyVYulpQSKhI+0umD6QMsi/BlmZnniLzjLXYZlgdZElwcmu/ece849MyOJHwOi2yluuIT3PuHDEmKPV/D5XU6XV3D70fqOS2R/goSw/J1EW/SyMexEB+EE/S33lTJN7w07+7OobcG3I0oaTF8yEJSTfALHSvi0ju4jNXJBf3ZxOoHWn82jeS643gU0Enraxe3q0qjgtccvIs8n0adrWxlV2XhPEjtCLzc337xFOB6muS84fDXIyMNOjhvo90p9ReEAVsP6AzlQPrDbYWFDRqckHsHpQ4MjXN1Fa9ZHqw/Zb832mD1jFzM8WN5Xy2FTT6Q2Qv2bKo426ZVClSIIw9GsWqqb9QDQxiAt8mtXlXuDrIy2/X6vZLNYgsHgqkMbw6rTAxkapjRG8t6ZIommEa/XxICQJw6fxc580UydVzOVtBYafK1AUppBUAbfDRbVXgafFSZtWH3qkHMzWt5xPCVzlNqY9IwGF3GGM8jSuJJNctKYUjbuASVn5/3rtildbWfFgW3wOaf2IguCJqk0Th0bA8LhH8w2erXlhHdb3oBjPhYmihs3tNbEjT1ASaIkuTzuBTFqI55iRjh2zrAGoHnMRiiXOYpGrZUZVE22cDdr6jxzWjjN5DhcJzkfVtr08kA/P2qvQJIVsw79uP3lPhxVT+3f0S6BA82GTPNFLBcg50WGIT2A3F4JIUIlj28kaBLevIEujs863z3Ex5lnwgPY2PwEpPu+JTVAzhxf8y3HQtNtLkxsZs+9uMe7rOj5kW9NkpCX77oyQCq7QzeMFOwVOY4so6eInCTZCijv4sKpRl+p0PwBu/YAByKGndD8WRtkW8265++xaQQ+SuB25h+cahwmq8D5/6yOb5KpiKaF/wEDJXsN"></Mermaid><h3 id="为什么-charles-能抓-https-包" tabindex="-1"><a class="header-anchor" href="#为什么-charles-能抓-https-包"><span>为什么 Charles 能抓 HTTPS 包？</span></a></h3>
<table>
<thead>
<tr>
<th>步骤</th>
<th>说明</th>
<th>关键点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1. 安装 CA 证书</strong></td>
<td>客户端安装 Charles 的自签名 CA 证书到系统信任列表</td>
<td>客户端信任 Charles CA，会信任 Charles 签发的所有证书</td>
</tr>
<tr>
<td><strong>2. 配置代理</strong></td>
<td>客户端配置代理指向 Charles</td>
<td>所有 HTTPS 流量都经过 Charles</td>
</tr>
<tr>
<td><strong>3. 签发伪造证书</strong></td>
<td>Charles 用自己 CA 私钥为任何域名签发证书</td>
<td>客户端信任 Charles CA，所以验证通过</td>
</tr>
<tr>
<td><strong>4. 双重 HTTPS 连接</strong></td>
<td>客户端 ↔ Charles（HTTPS）+ Charles ↔ 百度（HTTPS）</td>
<td>Charles 作为中间人，可以看到两端的明文数据</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>关键理解：</strong></p>
<ul>
<li><strong>Charles 能抓 HTTPS 包的前提</strong>：客户端主动安装并信任了 Charles 的 CA 证书</li>
<li><strong>这是合法的中间人</strong>：用户主动配置，用于调试和开发</li>
<li><strong>如果攻击者想用同样方式攻击</strong>：需要用户主动安装攻击者的 CA 证书，这在正常情况下不会发生</li>
</ul>
</blockquote>
<h3 id="为什么-charles-能通过验证" tabindex="-1"><a class="header-anchor" href="#为什么-charles-能通过验证"><span>为什么 Charles 能通过验证？</span></a></h3>
<p><strong>关键理解</strong>：Charles 返回的不是 Charles 自己的证书，而是<strong>为被访问域名签发的证书</strong>。</p>
<Mermaid code="eJyNkstOwkAYhfc8xTyAQnTZGBLFte9QsZEmCNgW2YqXWAKCFxJDMaAkXAIR4sIgUOm7mE4vq76C0860VEsTu2mTnu/8Z878PHOaZzJJZp+ljzn6JALQk6M5gU2yOTojgESaZdCL5gEcdzRxqo8mliyqyqu6WIBEiubSDA8Su5ZcCqLkL2LJZ0CyR7NHeVugN5Zw3os4goOswIDsGcOR4RuOivL81M+50RkZY8V8GsN2G97d6m9LWLs3JkV1RjwwuRmPE4gCxmSqvV9gCqQEIcdTsVihUIge2u7RZBaf3TfcJd25WrmniUPsE6bV6wNfK0DvF82HLgoMvClgTVgM2Gmd2CisUofNFtaguvEpLVnyXCy5YpcuEdSt/291FNA+akZfhI2BOawgPzJ2vRb/DA4D38+PYYjvFv6JYDGszMxrhBRDVHZ5qCjH1VdouC1qHq1nYDE9YrURBMCFmOeSodygOuFiro/KhtLSqt31e7jaBOPyC3PYQ5euYLUNmy8o684hF4tvRX916Z5V9F1fyRFuR8NyR34AtnmmSQ=="></Mermaid><blockquote>
<p><strong>Charles 能工作的原因：</strong></p>
<ul>
<li><strong>Charles 可以为任何域名签发证书</strong>：因为用户主动信任了 Charles CA</li>
<li><strong>证书域名匹配</strong>：访问 <code v-pre>baidu.com</code> 时，Charles 返回的是 <code v-pre>baidu.com</code> 的证书</li>
<li><strong>CA 签名验证通过</strong>：证书由 Charles CA 签名，用户信任 Charles CA，所以验证通过</li>
</ul>
</blockquote>
<h3 id="为什么攻击者无法像-charles-一样攻击" tabindex="-1"><a class="header-anchor" href="#为什么攻击者无法像-charles-一样攻击"><span>为什么攻击者无法像 Charles 一样攻击？</span></a></h3>
<p><strong>关键理解</strong>：攻击者无法为被攻击域名签发证书，只能返回自己的证书，导致域名不匹配，验证失败。</p>
<Mermaid code="eJyNUs9OwjAcvvMUDWeFOzEkiGffYeCiiwoIQ66CEiCAKMEgKCCGPwYDE4UAG8LLrF134hXsqBsoLrGXJu335/d9bYg9C7M+L7vHMYdB5tQCyAowQZ7zcgHGxwP3CceSjQkB2HtGyZHyKmxgXDzPeI/ZoIZCBQkmJHwRX0yT+PITpVso2UHDqJrILaapDeouwx2ENZ5SmkGxZVkC9v08C/znRJC6by1RjpU2fKtg4U4ed9XiQBZFek65lLHtdOpDOQAWRqgfw725WuyBI54PhBx2eyQSsXk0WZvXT1OvXFdUw3E9xz/QxSf0QeYTgWEBlO4M5m6xEJUnrR1P0O4kBaH3OnpMwVxRntdlSQJuF1DaUTXf1Kpa2ujiJBBNRuLMC/ChanjhRAeO+kr5ikoTVdiKAeabp1nrvf+ulQw8zOF2EpZe1E6G0KmCCZZewloN3mQX0/K6gRlj2bjBMGtbh1OgPM7CzESNE0b054PqODorbPTxgPSUQem8IlXwvIqum39/n7Wc6H6mNETrehbD0KoWSligv9v8damv5QsPxpDW"></Mermaid><blockquote>
<p><strong>关键点：</strong></p>
<ul>
<li><strong>证书域名必须匹配</strong>：访问 <code v-pre>baidu.com</code> 时，收到的证书必须是 <code v-pre>baidu.com</code> 的证书</li>
<li><strong>即使攻击者能拦截流量</strong>：如果返回的证书域名不匹配（如返回 <code v-pre>google.com</code> 的证书），浏览器会验证失败，攻击无法成功</li>
<li><strong>攻击者需要为被攻击域名签发证书</strong>：这需要受信任 CA 的私钥，几乎不可能获得</li>
</ul>
</blockquote>
<h3 id="charles-vs-真实攻击者的区别" tabindex="-1"><a class="header-anchor" href="#charles-vs-真实攻击者的区别"><span>Charles vs 真实攻击者的区别</span></a></h3>
<table>
<thead>
<tr>
<th>方面</th>
<th>Charles</th>
<th>真实攻击者</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>CA 证书来源</strong></td>
<td>自签名 CA（用户主动安装）</td>
<td>需要获得受信任的 CA 私钥（几乎不可能）</td>
</tr>
<tr>
<td><strong>证书签发能力</strong></td>
<td>可以为任何域名签发证书（用户信任 Charles CA）</td>
<td>无法为被攻击域名签发证书（没有 CA 私钥）</td>
</tr>
<tr>
<td><strong>证书域名匹配</strong></td>
<td>✅ 可以签发匹配的证书（如 baidu.com）</td>
<td>❌ 只能返回自己的证书（域名不匹配，验证失败）</td>
</tr>
<tr>
<td><strong>用户行为</strong></td>
<td>用户主动安装证书和配置代理</td>
<td>用户不会主动安装攻击者的证书</td>
</tr>
<tr>
<td><strong>目的</strong></td>
<td>调试、开发、测试</td>
<td>窃取数据、攻击</td>
</tr>
<tr>
<td><strong>合法性</strong></td>
<td>✅ 合法（用户授权）</td>
<td>❌ 非法</td>
</tr>
</tbody>
</table>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>
<table>
<thead>
<tr>
<th>层次</th>
<th>解决方案</th>
<th>解决的问题</th>
<th>遗留问题</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>第一层</strong></td>
<td>HTTP</td>
<td>-</td>
<td>明文传输，数据暴露</td>
</tr>
<tr>
<td><strong>第二层</strong></td>
<td>对称加密</td>
<td>✅ 解决明文传输</td>
<td>密钥分发问题</td>
</tr>
<tr>
<td><strong>第三层</strong></td>
<td>非对称加密</td>
<td>✅ 解决密钥分发</td>
<td>身份验证问题</td>
</tr>
<tr>
<td><strong>第四层</strong></td>
<td>数字证书</td>
<td>✅ 解决身份验证</td>
<td>✅ 完整方案</td>
</tr>
</tbody>
</table>
</div></template>


