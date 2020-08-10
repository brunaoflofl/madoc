<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:str="http://exslt.org/strings"
    xmlns:math="http://exslt.org/math"
    exclude-result-prefixes="xhtml">
<xsl:output method="xml" version="1.0" omit-xml-declaration="yes" 
  encoding="utf-8" media-type="text/xml" indent="yes"/>
<xsl:strip-space elements="*"/>
<xsl:preserve-space elements="listing plaintext pre samp"/>
<xsl:param name="font-size" select="''"/>
<xsl:param name="font.symbol" select="'Gentium Basic'"/>

<xsl:template name="common-atts">
  <xsl:copy-of select="@id|@color|@height|@width|@xml:lang"/>
  <xsl:if test="@align"><xsl:attribute name="text-align"><xsl:value-of select="@align"/></xsl:attribute></xsl:if>
  <xsl:if test="@nowrap"><xsl:attribute name="wrap-option">no-wrap</xsl:attribute></xsl:if>
  <xsl:call-template name="Trata-style"/>
</xsl:template>

<!-- Transoforma atributos CSS do atributo style em atributos XSL-FO -->
<xsl:template name="Trata-style">

    <xsl:for-each select="str:tokenize(@style, ';')">

        <xsl:variable name="atributo" select="."/>

        <xsl:if test="contains($atributo, ':')">
            <xsl:variable name="nome" select="normalize-space(substring-before($atributo, ':'))"/>
            <xsl:variable name="valor" select="normalize-space(substring-after($atributo, ':'))"/>
            <xsl:if test="starts-with($nome, 'text-') or starts-with($nome, 'font') or starts-with($nome, 'margin')">
                <xsl:attribute name="{$nome}"><xsl:value-of select="$valor"/></xsl:attribute>
            </xsl:if>
        </xsl:if>

    </xsl:for-each>

</xsl:template>

<xsl:template match="html">
  <fo:root>
    <fo:layout-master-set>
      <fo:simple-page-master master-name="page">
        <fo:region-body margin=".75in .75in .75in .75in"/>
        <fo:region-before extent=".5in"/>
        <fo:region-after extent=".5in"/>
      </fo:simple-page-master>
    </fo:layout-master-set>
    <fo:page-sequence master-reference="page">
      <fo:static-content flow-name="xsl-region-before">
        <fo:block display-align="after" padding-before=".2in" text-align="center" font-size="9pt">
          <xsl:apply-templates select="head/title"/>
        </fo:block>
      </fo:static-content>
      <fo:static-content flow-name="xsl-region-after">
        <fo:block display-align="before" text-align="center" font-size="8pt">
          <xsl:text>page </xsl:text>
          <fo:page-number/><xsl:text> of </xsl:text>
          <fo:page-number-citation ref-id="__END__"/>
        </fo:block>
      </fo:static-content>
      <xsl:apply-templates/>
    </fo:page-sequence>
  </fo:root>
</xsl:template>

<xsl:template match="title">
  <fo:block><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="basefont">
  <xsl:copy-of select="@color"/>
  <xsl:choose>
    <xsl:when test="@size=1"><xsl:attribute name="font-size">xx-small</xsl:attribute></xsl:when>
    <xsl:when test="@size=2"><xsl:attribute name="font-size">x-small</xsl:attribute></xsl:when>
    <xsl:when test="@size=3"><xsl:attribute name="font-size">small</xsl:attribute></xsl:when>
    <xsl:when test="@size=4"><xsl:attribute name="font-size">medium</xsl:attribute></xsl:when>
    <xsl:when test="@size=5"><xsl:attribute name="font-size">large</xsl:attribute></xsl:when>
    <xsl:when test="@size=6"><xsl:attribute name="font-size">x-large</xsl:attribute></xsl:when>
    <xsl:when test="@size=7"><xsl:attribute name="font-size">xx-large</xsl:attribute></xsl:when>
  </xsl:choose>
  <xsl:if test="@face"><xsl:attribute name="font-family"><xsl:value-of select="@face"/></xsl:attribute></xsl:if>
</xsl:template>

<xsl:template match="body">
  <fo:flow flow-name="xsl-region-body">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates select="//basefont[1]"/>
    <xsl:if test="$font-size"><xsl:attribute name="font-size"><xsl:value-of select="$font-size"/></xsl:attribute></xsl:if>
    <xsl:apply-templates/>
    <fo:block id="__END__"/>
  </fo:flow>
</xsl:template>

<xsl:template match="head|applet|area|base
  |bgsound|embed|frame|frameset|iframe
  |ilayer|layer|input[@type='hidden']
  |isindex|link|map|meta|object|param
  |ruby|rt|script|spacer|style|wbr
  |xml|xmp"/>
<xsl:template match="comment">
  <xsl:comment><xsl:apply-templates/></xsl:comment>
</xsl:template>
<xsl:template match="processing-instruction()">
  <xsl:copy-of select="."/>
</xsl:template>

<!-- Links and Media -->

<xsl:template match="a">
  <fo:inline><xsl:call-template name="common-atts"/>
    <xsl:if test="@name and not(@id)">
      <xsl:attribute name="id"><xsl:value-of select="@name"/></xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </fo:inline>
</xsl:template>

<xsl:template match="a[@href]">
  <fo:basic-link color="blue" text-decoration="underline">
    <xsl:if test="@type"><xsl:attribute name="content-type"><xsl:value-of select="@type"/></xsl:attribute></xsl:if>
    <xsl:choose>
      <xsl:when test="starts-with(@href,'#')">
        <xsl:attribute name="internal-destination"><xsl:value-of select="substring-after(@href,'#')"/></xsl:attribute>
      </xsl:when>
      <xsl:otherwise>
        <xsl:attribute name="external-destination">
          <xsl:text>url(&apos;</xsl:text>
          <xsl:value-of select="concat(//base/@href,@href)"/>
          <xsl:text>&apos;)</xsl:text>
        </xsl:attribute>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:basic-link>
</xsl:template>

<xsl:template match="img|input[@type='image']">
  <fo:external-graphic content-type="{@type}" src="{concat(//base/@href,@src)}">
    <xsl:call-template name="common-atts"/>
  </fo:external-graphic>
</xsl:template>

<xsl:template match="object[starts-with(@type,'image/')]">
  <fo:external-graphic content-type="{@type}" src="{concat(//base/@href,@data)}">
    <xsl:call-template name="common-atts"/>
  </fo:external-graphic>
</xsl:template>

<!-- Tables -->

<xsl:template name="get-style">
	<xsl:param name="node"/>
	<xsl:param name="styleName"/>
    <xsl:for-each select="str:tokenize($node/@style, ';')">
        <xsl:variable name="atributo" select="normalize-space(.)"/>
        <xsl:if test="contains($atributo, ':')">
            <xsl:variable name="nome" select="normalize-space(substring-before($atributo, ':'))"/>
            <xsl:if test="$nome = 'width'">
    	        <xsl:value-of select="normalize-space(substring-after($atributo, ':'))"/>
	        </xsl:if>
        </xsl:if>
    </xsl:for-each>
</xsl:template>

<xsl:template name="table-width">
    <xsl:for-each select="str:tokenize(@style, ';')">
        <xsl:variable name="atributo" select="."/>
        <xsl:if test="contains($atributo, ':')">
            <xsl:variable name="nome" select="normalize-space(substring-before($atributo, ':'))"/>
            <xsl:variable name="valor" select="normalize-space(substring-after($atributo, ':'))"/>
            <xsl:if test="$nome = 'width'">
                <xsl:attribute name="column-width"><xsl:value-of select="$valor"/></xsl:attribute>
            </xsl:if>
        </xsl:if>
    </xsl:for-each>
</xsl:template>

<xsl:template name="table-common-atts">
  <xsl:choose>
	  <xsl:when test="@border = 0">
		  <xsl:attribute name="border-style">none</xsl:attribute>
	  </xsl:when>
	  <xsl:otherwise>
		  <xsl:attribute name="border">1pt solid</xsl:attribute>
	  </xsl:otherwise>
  </xsl:choose>
  <xsl:attribute name="border-collapse">collapse</xsl:attribute>
  <xsl:attribute name="table-layout">fixed</xsl:attribute>
  <xsl:copy-of select="@id|@color|@height|@width|@xml:lang"/>
  <xsl:if test="@nowrap"><xsl:attribute name="wrap-option">no-wrap</xsl:attribute></xsl:if>
</xsl:template>

<xsl:template match="table">

<!-- A primeira tabela serve apenas para centralizar a segunda -->
<fo:table table-layout="fixed" width="100%">
  <fo:table-column column-width="proportional-column-width(1)"/>
  <fo:table-column>
	<xsl:call-template name="table-width"/>
  </fo:table-column>
  <fo:table-column column-width="proportional-column-width(1)"/>
  <fo:table-body>
    <fo:table-row>
      <fo:table-cell column-number="2">
        <fo:block>
        
          <!-- Conversão da tabela -->
		  <fo:block text-align="left" text-indent="0">
			  <xsl:apply-templates select="caption"/>
			  <fo:table>
			  	<xsl:call-template name="table-common-atts"/>
			    <xsl:apply-templates select="colgroup|col"/>
			    <!-- Número de colunas -->
			    <xsl:variable name="tr1" select="(tr|thead/tr|tbody/tr|tfoot/tr)[1]"/>
				<xsl:variable name="colsCount" select="(count($tr1/*[not(@colspan)])+sum($tr1/*/@colspan))"/>
			    <xsl:call-template name="mock-col">
			      <xsl:with-param name="cols" select="$colsCount"/>
			    </xsl:call-template>
			    <xsl:apply-templates select="thead|tfoot|tbody"/>
			    <xsl:if test="tr">
			      <fo:table-body><xsl:call-template name="common-atts"/>
			        <xsl:apply-templates select="tr"/>
			      </fo:table-body>
			    </xsl:if>
			  </fo:table>
		  </fo:block>
  
        </fo:block>
      </fo:table-cell>
    </fo:table-row>
  </fo:table-body>
</fo:table>
  
</xsl:template>

<xsl:template match="colgroup">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template name="mock-col">
  <xsl:param name="cols" select="1"/>
  
  <xsl:variable name="colwidths" select="@colwidths"/>
  
  <xsl:if test="$colwidths">
    <xsl:for-each select="str:tokenize($colwidths, ',')">
    	<xsl:variable name="width" select="."/>
   		<fo:table-column>
   			<xsl:attribute name="column-width">proportional-column-width(<xsl:value-of select="$width"/>)</xsl:attribute>
   		</fo:table-column>
    </xsl:for-each>  
  </xsl:if>
  
  <xsl:if test="$cols&gt;0 and not($colwidths)">
	<fo:table-column column-width="proportional-column-width(1)"/>
    <xsl:call-template name="mock-col">
      <xsl:with-param name="cols" select="$cols -1"/>
    </xsl:call-template>
  </xsl:if>

</xsl:template>

<xsl:template match="col">
  <fo:table-column>
  	<xsl:call-template name="common-atts"/>
    <xsl:if test="@span">
      <xsl:attribute name="number-columns-spanned"><xsl:value-of select="@span"/></xsl:attribute>
    </xsl:if>
    <xsl:choose>
      <xsl:when test="@width">
        <xsl:attribute name="column-width"><xsl:value-of select="@width"/></xsl:attribute>
      </xsl:when>
      <!-- 
      <xsl:otherwise>
        <xsl:attribute name="column-width">proportional-column-width(1)</xsl:attribute>
      </xsl:otherwise>
       -->
    </xsl:choose>
  </fo:table-column>
</xsl:template>

<xsl:template match="tbody">
  <fo:table-body>
  	<xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:table-body>
</xsl:template>

<xsl:template match="thead">
  <fo:table-header>
  	<xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:table-header>
</xsl:template>

<xsl:template match="tfoot">
  <fo:table-footer>
  	<xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:table-footer>
</xsl:template>

<xsl:template match="tr">
  <fo:table-row>
  	<xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:table-row>
</xsl:template>

<xsl:template match="th">
  <fo:table-cell font-weight="bold" padding=".2em" display-align="center">
    <xsl:call-template name="common-atts"/>
  	<xsl:if test="ancestor::table[1][@border!=0]">
  		<xsl:attribute name="border">1pt solid</xsl:attribute>
  	</xsl:if>
    <xsl:if test="@colspan">
      <xsl:attribute name="number-columns-spanned"><xsl:value-of select="@colspan"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@rowspan">
      <xsl:attribute name="number-rows-spanned"><xsl:value-of select="@rowspan"/></xsl:attribute>
    </xsl:if>
    <fo:block font-size="80%" line-height="140%">
      <xsl:apply-templates/>
    </fo:block>
  </fo:table-cell>
</xsl:template>

<xsl:template match="td">
  <fo:table-cell padding=".2em">
  	<xsl:call-template name="common-atts"/>
  	<xsl:if test="ancestor::table[1][@border!=0]">
  		<xsl:attribute name="border">1pt solid</xsl:attribute>
  	</xsl:if>
    <xsl:if test="@colspan">
      <xsl:attribute name="number-columns-spanned"><xsl:value-of select="@colspan"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@rowspan">
      <xsl:attribute name="number-rows-spanned"><xsl:value-of select="@rowspan"/></xsl:attribute>
    </xsl:if>
    <fo:block font-size="80%" line-height="140%">
      <xsl:apply-templates/>
    </fo:block>
  </fo:table-cell>
</xsl:template>

<!-- Lists -->

<xsl:template match="dd">
  <fo:list-item><xsl:call-template name="common-atts"/>
    <fo:list-item-label><fo:block/></fo:list-item-label>
    <fo:list-item-body start-indent="body-start()">
      <fo:block>
        <xsl:apply-templates/>
      </fo:block>
    </fo:list-item-body>
  </fo:list-item>
</xsl:template>

<xsl:template match="dl">
  <fo:list-block provisional-label-separation=".2em" provisional-distance-between-starts="3em">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:list-block>
</xsl:template>

<xsl:template match="dt">
  <fo:list-item><xsl:call-template name="common-atts"/>
    <fo:list-item-label><fo:block/></fo:list-item-label>
    <fo:list-item-body start-indent="body-start()">
      <fo:block>
        <xsl:apply-templates/>
      </fo:block>
    </fo:list-item-body>
  </fo:list-item>
</xsl:template>

<xsl:template match="ol">
  <fo:list-block provisional-label-separation="1em" 
    	provisional-distance-between-starts="{string-length(string(count(li)))*.9+.6}em"
     	margin-left="2.5cm" text-indent="0">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:list-block>
</xsl:template>

<xsl:template match="ol/li">
  <fo:list-item><xsl:call-template name="common-atts"/>
    <fo:list-item-label end-indent="label-end()">
      <fo:block text-align="end">
        <xsl:variable name="value">
          <xsl:choose>
            <xsl:when test="@value"><xsl:value-of select="@value"/></xsl:when>
            <xsl:otherwise><xsl:number/></xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:choose>
          <xsl:when test="@type='I'"><xsl:number format="I" value="$value"/></xsl:when>
          <xsl:when test="@type='A'"><xsl:number format="A" value="$value"/></xsl:when>
          <xsl:when test="@type='i'"><xsl:number format="i" value="$value"/></xsl:when>
          <xsl:when test="@type='a'"><xsl:number format="a" value="$value"/></xsl:when>
          <xsl:when test="parent::ol/@type='I'"><xsl:number format="I" value="$value"/></xsl:when>
          <xsl:when test="parent::ol/@type='I'"><xsl:number format="A" value="$value"/></xsl:when>
          <xsl:when test="parent::ol/@type='I'"><xsl:number format="i" value="$value"/></xsl:when>
          <xsl:when test="parent::ol/@type='I'"><xsl:number format="a" value="$value"/></xsl:when>
          <xsl:otherwise><xsl:number format="1" value="$value"/></xsl:otherwise>
        </xsl:choose>
        <xsl:text>.</xsl:text>
      </fo:block>
    </fo:list-item-label>
    <fo:list-item-body start-indent="body-start()">
      <fo:block>
        <xsl:apply-templates/>
      </fo:block>
    </fo:list-item-body>
  </fo:list-item>
</xsl:template>

<xsl:template match="ul|menu">
  <fo:list-block provisional-label-separation="1em" provisional-distance-between-starts="1em" margin-left="2.5cm" text-indent="0">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:list-block>
</xsl:template>

<xsl:template match="ul/li|menu/li">
  <fo:list-item><xsl:call-template name="common-atts"/>
    <fo:list-item-label end-indent="label-end()">
      <fo:block text-align="end">
      		<xsl:text disable-output-escaping="yes">&amp;#x2022;</xsl:text>
      <!-- 
        <fo:inline font-family="{$font.symbol}">
          <xsl:choose>
          &#x25cf;
            <xsl:when test="@type='square'"><xsl:text disable-output-escaping="yes">&amp;#x25AA;</xsl:text></xsl:when>
            <xsl:when test="@type='circle'"><xsl:text disable-output-escaping="yes">&amp;#x25CB;</xsl:text></xsl:when>
            <xsl:when test="parent::ul/@type='square'">
              <xsl:text disable-output-escaping="yes">&amp;#x25AA;</xsl:text>
            </xsl:when>
            <xsl:when test="parent::ul/@type='circle'">
              <xsl:text disable-output-escaping="yes">&amp;#x25CB;</xsl:text>
            </xsl:when>
            <xsl:otherwise><xsl:text disable-output-escaping="yes">&amp;#x2022;</xsl:text></xsl:otherwise>
          </xsl:choose>
        </fo:inline>
       -->
      </fo:block>
    </fo:list-item-label>
    <fo:list-item-body start-indent="body-start()">
      <fo:block>
        <xsl:apply-templates/>
      </fo:block>
    </fo:list-item-body>
  </fo:list-item>
</xsl:template>

<!-- Blocks -->

<xsl:template match="address">
  <fo:block font-style="italic"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="blockquote">
  <fo:block space-before="1em" space-after="1em" start-indent="3em" text-indent="0">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="br">
  <fo:block white-space="pre" line-height="0">
  	<xsl:call-template name="common-atts"/>
    <xsl:text disable-output-escaping="yes">&amp;#10;</xsl:text>
  </fo:block>
</xsl:template>

<xsl:template match="caption">
  <fo:block keep-with-next="always" text-align="center">
    <xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="center">
  <fo:block text-align="center">
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="div|multicol|noembed|noframes
  |nolayer|noscript">
  <fo:block><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h1">
  <fo:block font-size="180%" font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h2">
  <fo:block font-size="160%" font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h3">
  <fo:block font-size="140%" font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h4">
  <fo:block font-size="120%" font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h5">
  <fo:block font-size="110%" font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="h6|legend">
  <fo:block font-weight="bold"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="hr">
  <fo:leader leader-pattern="rule" rule-style="groove">
    <xsl:if test="@size">
      <xsl:attribute name="rule-thickness"><xsl:value-of select="@size"/><xsl:text>pt</xsl:text></xsl:attribute>
    </xsl:if>
  </fo:leader>
</xsl:template>

<xsl:template match="listing|plaintext|pre|samp">
  <fo:block white-space="pre"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<xsl:template match="p">
  <fo:block><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>

<!-- Inlines -->

<xsl:template match="abbr|acronym">
  <fo:inline><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:inline>
  <xsl:text> (</xsl:text>
  <xsl:value-of select="@title"/>
  <xsl:text>)</xsl:text>
</xsl:template>

<xsl:template match="b|strong">
  <fo:inline font-weight="bold"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="bdo">
  <fo:bidi-override direction="{@dir}"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:bidi-override>
</xsl:template>

<xsl:template match="big">
  <fo:inline font-size="larger"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="blink|marquee">
  <fo:inline background-color="yellow"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="cite|dfn|em|i|var">
  <fo:inline font-style="italic"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="code|kbd|tt">
  <fo:inline font-family="monospace"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:inline>
</xsl:template>

<xsl:template match="del|s|strike">
  <fo:inline text-decoration="line-through"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="font">
  <fo:inline><xsl:call-template name="common-atts"/><xsl:choose>
      <xsl:when test="@size=1"><xsl:attribute name="font-size">xx-small</xsl:attribute></xsl:when>
      <xsl:when test="@size=2"><xsl:attribute name="font-size">x-small</xsl:attribute></xsl:when>
      <xsl:when test="@size=3"><xsl:attribute name="font-size">small</xsl:attribute></xsl:when>
      <xsl:when test="@size=4"><xsl:attribute name="font-size">medium</xsl:attribute></xsl:when>
      <xsl:when test="@size=5"><xsl:attribute name="font-size">large</xsl:attribute></xsl:when>
      <xsl:when test="@size=6"><xsl:attribute name="font-size">x-large</xsl:attribute></xsl:when>
      <xsl:when test="@size=7"><xsl:attribute name="font-size">xx-large</xsl:attribute></xsl:when>
    </xsl:choose><xsl:if test="@face"><xsl:attribute name="font-family"><xsl:value-of select="@face"/></xsl:attribute></xsl:if><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="ins|u">
  <fo:inline text-decoration="underline"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="nowrap">
  <fo:inline wrap-option="no-wrap"><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:inline>
</xsl:template>

<xsl:template match="q">
  <fo:inline><xsl:call-template name="common-atts"/>
    <xsl:text disable-output-escaping="yes">&amp;#x201C;</xsl:text>
    <xsl:apply-templates/>
    <xsl:text disable-output-escaping="yes">&amp;#x201D;</xsl:text>
  </fo:inline>
</xsl:template>

<xsl:template match="q[starts-with(.,'&#x22;') or starts-with(.,'&#x201C;') or starts-with(.,'&#x201F;')]">
  <fo:inline><xsl:call-template name="common-atts"/>
    <xsl:apply-templates/>
  </fo:inline>
</xsl:template>

<xsl:template match="small">
  <fo:inline font-size="smaller"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="span">
	<xsl:choose>
		<xsl:when test="@class='omissis'">
			<fo:leader leader-pattern="dots" leader-length.optimum="100%" />
		</xsl:when>
		<xsl:otherwise>
			<fo:inline><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
		</xsl:otherwise>
	</xsl:choose>	
</xsl:template>

<xsl:template match="sub">
  <fo:inline baseline-shift="sub" font-size="0.7em"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="sup">
  <fo:inline baseline-shift="super" font-size="0.7em"><xsl:call-template name="common-atts"/><xsl:apply-templates/></fo:inline>
</xsl:template>

</xsl:stylesheet>
