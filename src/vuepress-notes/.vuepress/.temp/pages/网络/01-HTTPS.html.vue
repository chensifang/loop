<template><div><h1 id="https" tabindex="-1"><a class="header-anchor" href="#https"><span>HTTPS</span></a></h1>
<h2 id="第一层-http-的问题" tabindex="-1"><a class="header-anchor" href="#第一层-http-的问题"><span>第一层：HTTP 的问题</span></a></h2>
<p><strong>问题</strong>：HTTP 是明文传输，数据在网络上以明文形式传输，任何人都可以读取。</p>
<img src="https://www.plantuml.com/plantuml/svg/ZPB1Ji9048RlVOeD9qWatZaOZ1Sza9Z82pHOjH4BAQldLYs8eHQb4XLYG4D2aBHgZ0IB-Z1sjkNaAxXsAH6zU9e_sN_c-sUooGBcPRoxa-MIKvMdLSo8ULx2A0BM3JaQU7Ts1F45j9GL1GdFEeZfGCdn5Gr5KolfL2mmBcBCPxO5-PUrgSDn6owxWMTDaFUeWvDoM40vAYVZvoOl2RISJgyYSd52wYLtrFBVQf-Z2Zc_9xe5LWMqBhbw6ZSVEOxreVZ2b9j0O9oE5TMt1-HX7qNPa0Jop2vT1whwFDX5hwN665qMDxSmoctyw9-k1ORjEXtVTi2eax92ccKMWGkztzmmiV_Qf-2GIbizkqtC8HGri8OnZjbGV2Qf_sv2unfgEhoOOLA6-7SwhtS0rVw7eZ8S5UweDrPQVv9IC3jM63N4qZd4E0EjGzHdScYupcrmdQGWhGU_WzKl" alt="PlantUML Diagram">
<blockquote>
<p><strong>问题总结</strong>：明文传输导致数据完全暴露，攻击者可以窃听、篡改、伪造数据。</p>
</blockquote>
<h2 id="第二层-对称加密解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第二层-对称加密解决了什么问题"><span>第二层：对称加密解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用对称加密加密数据，客户端和服务器共享密钥 K。</p>
<p><strong>解决了</strong>：明文传输问题。即使被截获，攻击者没有密钥 K，无法解密。</p>
<img src="https://www.plantuml.com/plantuml/svg/XLBBJi905DttAsvOQG8_uC9WZ2kMVa63LHkna3AwDYeFYO0FG5I2W44Q96rN4jCYFzCxBIj-mTgXJJ4HLtFIEUUUC-SsdYMyJ4wEKrmyG1dt59DYXfS8H53jqUBOVjSYm6TXEoKA4bbcq9g11SCvotcCBKBuv94W_-AqobZgugFYSNO5-THbS5AQ291suM9kT76p0TPaQjSKr3xjWOwb3cfvI003jAxJiifnJ0AnpK24R-VMf8xg5UOKREbOp6FrrbNCxlgGc9ilA_mOYobc3-girmmR-6_oB6YxHPiLsYXOPiVvklVdi-6oU7188BqVaWJrqEBGgOm3liy8ly2PZ4AHEVOPOaiHd6aDdzlXBc1dBH45XjV_p-4Lonp06RowU6vUMqRPllp0gcOPVNjuWJUZK43NdvNX9_Hty7UXjA6p7kVcqugz_6mbBaXxtW_8pcy0" alt="PlantUML Diagram">
<blockquote>
<p><strong>新问题</strong>：密钥 K 如何安全地分发给客户端和服务器？如果通过网络明文传输 K，攻击者可以截获 K，加密失效。</p>
</blockquote>
<h2 id="第三层-非对称加密解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第三层-非对称加密解决了什么问题"><span>第三层：非对称加密解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用非对称加密解决密钥分发问题。服务器生成公钥 K_pub（公开）和私钥 K_priv（保密）。</p>
<p><strong>解决了</strong>：密钥分发问题。即使攻击者截获了加密的对称密钥，没有私钥 K_priv 也无法解密。</p>
<img src="https://www.plantuml.com/plantuml/svg/ZLFBJjj05DtFLunOe4HAVo0B58HOL8XLsLS1tDOgTIBRi3Oluz0ysf9Neq085Kq4A8xA0a9iyZE-OtkLN-Z4upWsYX2hUPrpxpbdPbAId1RbtMyxA1NCidJaj_XiMf3n0lIkYFPWt-eBE2tXbHsU4-GeWfI7S39qb6CSMt-_iHxtWCkodDxwoealeCq2dBRXTzV3VE34FOf0GaRcS8PE_V89_oI9BNDabxlk-GNe0xlJXzDBq5MdymVKUpfnVrs3faBf9qACWDyj1LIxt2BQ3pY-eoYyzZ6xkuaNiTtPzvSYlnSYiRv9J6kvodw452Fr8gcUn9bAaV_yHSQPJu6_90xiMuCMb7HhU4sq6wVumFW8iThXBhuqPicpGR4I9qbyHWZ1Pore1huQbi0CdiIhCUyaCTjxWrIcq39LKhiazvL9ehewDZJohqsQkKXAOoE7fXN2-Jhc7KrhRljvbz6D5CMi8zK0pxMG-LUU0fJof3gmYtreTjr3aygSySP67Wm5Ej_3pyHL6jQe7SfpMcaYsIScCAdqIQ4Nd_CM8Z0uAy1JEOxU4EsyHCDISw-v9DM-M-kvL_MnqO2_1vPPiTizQtJkNp-fwy4NiXj7rBUZvAt7mcH_Ai3RRw4K9snxtvgD_m40" alt="PlantUML Diagram">
<blockquote>
<p><strong>新问题</strong>：如何确保客户端拿到的公钥 K_pub 确实是服务器的，而不是攻击者伪造的？攻击者可以伪装成服务器，发送自己的公钥 K_attacker_pub，中间人攻击仍然存在。</p>
</blockquote>
<h2 id="第四层-数字证书解决了什么问题" tabindex="-1"><a class="header-anchor" href="#第四层-数字证书解决了什么问题"><span>第四层：数字证书解决了什么问题</span></a></h2>
<p><strong>解决方案</strong>：使用数字证书验证服务器身份。CA（证书颁发机构）用私钥对服务器信息（域名、公钥等）签名，生成证书。</p>
<p><strong>解决了</strong>：身份验证问题。攻击者无法伪造证书（没有 CA 的私钥），无法伪装成服务器。</p>
<img src="https://www.plantuml.com/plantuml/svg/XLJBRjf05DtxAqPPL23H7s1HWQmkgYghT1_Hr6cjKa36oTeefI49hwOGb9O0QKAn88cfKWdn2XzJxdYyuXSwcJ76fbQxcj7CEVUUU--PYQJLcABkVOWB4MUNegky8wTY2HLjmDrtd1kOFMC3nT98ZCjIGlKYS6KCXsEYPL5WyyMhpI03HbKrjlDUKjQWzG8SNyAvpZ1RahA_ZY16PZxyWUiZtFY80cAKHnEZWf18gX9AKe8j8cJpmsW-dPaL7LVxS5lZVAkRfnid6ndrvkEf8702UlhCePgL9iwL8NjZdRRHo-qqEzvExRr6Jv3PoNXF5NdV5KACFjBlYJ7WEHUJ7EIpKEv1imdbmcyjuuwtc1m9OdJ5q-bgPp1l7oYUA-6Xa2WfgWrVAYMp2dnhkE_TMbX7mWXAdoqjum8vej2w6DPEHNxxJaN9NMTSOUHC4_eNnAZE9rrBQ_68mXBrTqetZER4jHQ-hrhQLp8xP8Mo4lbKM2SOsHt6xWYV10VoQ9pAvSQbNQPsIN9dvHou_ab-jHUJF3uvDSSNPDR0nRRWau_3kS97UAaCfJDFatn5ChSOGxFJ1-FJqXtfj9nCkE0hS-bUJy5nYz9Md31w7d03GgkheAzPTJzF8jAvec59SG0FDPUWVxmOAENnsT0izg6kMmTJN3zQyMWtOA91vyIkasccZPhFBdrgv0KmOWZH9uWBTq4VOtfWyAK0eqfG-By7kO-yviexX-GgIyVXl7BdokmUGFc6Yn4YKk8D-zxu-WS0" alt="PlantUML Diagram">
<blockquote>
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
<img src="https://www.plantuml.com/plantuml/svg/fLLTJzfG6BxdLvnuDJE7avij95lSt98bkraoBqqCQfqaM0WjutQO8QXyEPdV0Hb1ZMw5nGkKClWpd7FA5NzXfttBQIlLRHbSjEbvd-Syp_kyfvsMv41KZgs6FDFyBiAkmSLW923AQ0mhtqYwII_hWtQwdypINqfFhTB2-g2zCOO24fe91GLHTc9cLWBHa20n1DIIuopUhE23S_GGQQaB-gE32raqyu9pGBsJX1vqSElKM7yP22x5F1unB0ie_568cfjEm89_Y4TaSmUzcPrzznxXJ98UViR9gtvH6RGFkObUjz9JLGvWDKo6nmDywD5pazcFx5P99eKBsyXoXK_Nq9JlYVSn-q_vdx8VS-92WfKDhPgyjHlIwedUpIbED-YLIjKoICBfFQroxb02A3-hRvAVQvhIxUyfQ4MM8v9_SZ8UZtiNTFVUnV0gT2OQ_B0Ye_2oXUGR5yiaNK2yNbS2AkP4PeSMptafqqVF4lqlDGX9z-KPhjcSQTqYFYfP6x3Y_3PdPPnyBvt1a1SIba4TRuwPIVyYms13FJfFha7swmv9GtwsVdJIksxTob4VfGpmz3yTQjsKMwGaNy3vNNiQEFcTEKLlvnVXsNmajk02XFRX-WqzQ-3wEa0aGPA2OT4jCBsV3aw4DqyOq8PozDIEu-gC4BIpAiDfkIRkxDdGemU1SrYJVftZP5XjqSijysXetHB9rHmAp6Fq5uDcL3gdqvW4EAoifVIuZ9KIXEbg4bA2-dlA82meup4PEY0ar_RT7PFFnIx4n3b7Gl9PRYs4QVIUT7psU63JaHSL2yUqvfhCw4YzVi3v9yoSoDS6oIhZVphx89Az0r_PATWZifiQHyyGsS-nEw2S4_d4vEizjKQFjzXh2YfWkq4xuT99cphVRNak8-CinpjPt2h-XnlVg1tW_6SxmmFlwBPJtxGWBXbVIxZ-1W00" alt="PlantUML Diagram">
<h3 id="为什么-charles-能抓-https-包" tabindex="-1"><a class="header-anchor" href="#为什么-charles-能抓-https-包"><span>为什么 Charles 能抓 HTTPS 包？</span></a></h3>
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
<div class="hint-container info">
<p class="hint-container-title">关键理解</p>
<ul>
<li><strong>Charles 能抓 HTTPS 包的前提</strong>：客户端主动安装并信任了 Charles 的 CA 证书</li>
<li><strong>这是合法的中间人</strong>：用户主动配置，用于调试和开发</li>
<li><strong>如果攻击者想用同样方式攻击</strong>：需要用户主动安装攻击者的 CA 证书，这在正常情况下不会发生</li>
</ul>
</div>
<h3 id="为什么-charles-能通过验证" tabindex="-1"><a class="header-anchor" href="#为什么-charles-能通过验证"><span>为什么 Charles 能通过验证？</span></a></h3>
<p><strong>关键理解</strong>：Charles 返回的不是 Charles 自己的证书，而是<strong>为被访问域名签发的证书</strong>。</p>
<img src="https://www.plantuml.com/plantuml/svg/TLFBJi905DttAoQi5Q9B5WRbDxgfKAG930IARCL7B0711ua132W9Zq24k308LFelfjF7Ybzmsbjg4LtDfEUUC-UScOQo8fSHSya44t9tQReA4I7DOH7voBYZILDzD5d9aggyg8i52iUvJ8BFel3XIYxw44Tt2O77uYRHcG8Szfi3Udr9vZqRF-A4Q8vXS4haKUgKppY2Em04tHFLZxdH6HbZnNmSatQRtDxehqjIlJCc1NNMOnYWeTs3DIE8ZCbKUpi72egBOZeR30Jo-Rp_s9BsHr99E3OZdCH5b8hzCDU7QgMU9Wr1XyLwRU0f0EdzWddVfRwGguT-UNA6BLEsFUf9gP5c2mPehP1a9JTSYPLSjifjE5nQCvXCy37mw0XfxrMZBv7wm1oMgHmeiXZMRLdqzVH0KKzzsoXy9-MPUKNH0ekja3IGFUi9RW_JCkZZs7eM5kYz2ySjc3JF6ePoJHEInLmVbGobfLMwpD_vrfB6nIVGG49lN99AcpIVgIKMx_cHD_3QkkHfiyZYVJ_wnoqJud7K_WDW_GO0" alt="PlantUML Diagram">
<blockquote>
<p><strong>Charles 能工作的原因：</strong></p>
<ul>
<li><strong>Charles 可以为任何域名签发证书</strong>：因为用户主动信任了 Charles CA</li>
<li><strong>证书域名匹配</strong>：访问 <code v-pre>baidu.com</code> 时，Charles 返回的是 <code v-pre>baidu.com</code> 的证书</li>
<li><strong>CA 签名验证通过</strong>：证书由 Charles CA 签名，用户信任 Charles CA，所以验证通过</li>
</ul>
</blockquote>
<h3 id="为什么攻击者无法像-charles-一样攻击" tabindex="-1"><a class="header-anchor" href="#为什么攻击者无法像-charles-一样攻击"><span>为什么攻击者无法像 Charles 一样攻击？</span></a></h3>
<p><strong>关键理解</strong>：攻击者无法为被攻击域名签发证书，只能返回自己的证书，导致域名不匹配，验证失败。</p>
<img src="https://www.plantuml.com/plantuml/svg/XPBBJi9058RtynGJrWfx5WRbDTXKgDe8XS0WMr49646KO12y88QBmK35Iy0MuMKwq-cALt3eo5XNhixaNFxlFwSDf92KHEbO50J4Ay6Y4bOIaegW1myVIM5iFMiUAALWCAh8AlhRGQe6pXlqCBUO5kZn5pdhaaAVV6JjV7anFNN6DX6Imljoyk-WLPzXlUiqR4bA90s06aSoZ1_8oH_G6Y_ueM3WbpkgNPcJWLrxDtMTvm7WxN1zGw3ya6fZCZgYmxbT6y8zX18fly-NoMIysqjDRpWUuxoaihk7O7p7DIfmxcL2wc-wza3Uc0iT2Yre3MQuV4crhFdP3Qdi5kIrHMvFSRbcpbkcOS3W9hHwMRlIOLS1O0LRUkRkcUDv5T_S2mhDz_5uP3LEk2YJnDqZAFqCBg5B9MU7gBpZhB1I8XzbsYlW-fFTBxBfbIiUSRE9BqgBQSCjnOhEfKHHR1PIUSwSb73nqywnOjPry1MIat1xHD_PXaLoLh6CEpg_9-STy8z9SZspshh7xKx0F7QrJZNjdq_5iI0Wgn7dN-Rn6m00" alt="PlantUML Diagram">
<blockquote>
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


