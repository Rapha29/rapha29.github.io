//Área de código HTML
var _html = document.getElementById('html-editor')
//Área de código CSS
var _css = document.getElementById('css-editor')
//Área de código JS
var _js = document.getElementById('js-editor')
// Resultado
var preview_panel = document.getElementById('preview-panel').contentWindow.document
// Botão de Execução
var _compile = document.getElementById('execute_code')


// Compilando e Executando o código
_compile.addEventListener('click', function(){
    preview_panel.open()
    preview_panel.writeln(`<style>${_css.value}</style>`)
    preview_panel.writeln(`${_html.value}`)
    preview_panel.writeln(`<script>${_js.value}</script>`)
    preview_panel.close()
})