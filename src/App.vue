<template>
  <div class="main">
    <!-- 格式化选项 -->
    <div class="options">
      <div class="indent">
        <div class="category">indent</div>
        <el-input-number v-model="indentConfig.indent" :min="1" :max="10" @change="getConfig" />
      </div>
      <el-checkbox-group v-model="checkList">
        <div class="list" v-for="(value, name, index) in spaceConfig" :key="index">
          <div class="category" data-action="toggle-item">
            {{name}}
            <!-- <span class="fold" data-action="toggle-item">-</span> -->
          </div>
          <div class="block"  v-for="(v, i) in value" :key="i">
            <el-checkbox class="option" :label="v" @change="getConfig" />
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <!-- 源代码 -->
    <div class="source">
      <textarea spellcheck="false" v-model="sourceCode"></textarea>
    </div>
    <!-- 格式化效果 -->
    <div class="panel">
      <highlightjs language="javascript" :code="newCode" />
    </div>
  </div>
</template>

<script>
import * as espree from "espree"
import 'element-plus/es/components/input-number/style/css'
import 'element-plus/es/components/checkbox/style/css'
import { ElInputNumber, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { onMounted, reactive, toRefs } from "vue"
export default {
  setup() {
    const state = reactive({
      indentConfig: {
          indent: 4,
      },
      spaceConfig: {
          before_parentheses: [
              // 函数定义
              "function_declaration",
              // 函数调用
              "function_call",
              "if",
              "for",
              "while",
              "switch",
              "catch",
              "function_expression",
              "async_arrow_function",
          ],
          around_operator: [
              // =, +=, -=
              "assignment_operator",
              // &&, ||
              "logical_operator",
              // ==, !=, '===', '!=='
              "equality_operator",
              // <, >, <=
              "relational_operator",
              // &, |, ^
              "bitwise_operator",
              // +, -,
              "additive_operator",
              // *, /, %
              "multiplicative_operator",
              // <<, >>, >>>
              "shift_operators",
              // +, -, ++, --
              "unary_additive_operators",
              // =>
              "arrow_function",
              // !, !!
              "before_unary",
              // !, !!
              "after_unary",
          ],
          before_left_brace: [
              "function_left_brac",
              "if_left_brace",
              "else_left_brace",
              "for_left_brace",
              "while_left_brace",
              "do_left_brace",
              "switch_left_brace",
              "try_left_brace",
              "catch_left_brace",
              "finally_left_brace",
              "class_left_brace",
          ],
          before_keywords: [
              "else_keyword",
              "while_keyword",
              "catch_keyword",
              "finally_keyword",
          ],
          within: [
              "index_access_brackets",
              "grouping_parentheses",
              "function_declaration_parentheses",
              "function_call_parentheses",
              "if_parentheses",
              "for_parentheses",
              "while_parentheses",
              "switch_parentheses",
              "catch_parentheses",
              "object_literal_braces",
              "es6_import_or_export_braces",
              "array_brackets",
              "interpolation_expressions",
          ],
          in_ternary_operator: [
              'before_?',
              'after_?',
              'before_:',
              'after_:',
          ],
          other: [
              "before_comma",
              "after_comma",
              "before_for__semicolon",
              "before_property_name_value_separator",
              "after_property_name_value_separator",
              'after_..._in_rest_or_spread',
              'before_*_in_generator',
              'after_*_in_generator',
          ],
      },
      sourceCode: `
function*fibonacci(current=1,next=1){
    yield current
    yield*fibonacci(next,current+next)
}

let [first, second, ...rest] = take(fibonacci(...[1, 2, 3]), 10)
`

// import {Component,Message} from 'react'

// export class Greeter{
//     greetNTimes(to,{from,times}){
//         return range(times).map(item=>this.greet(to,from))
//     }
// }

// export class ConsoleGreeter extends Greeter {
//     greet (to, from) {
//         return \`Hello, \${to} from \${from.join(',')}\`
//     }
// }


// export class ReactGreeter extends Greeter{
//     greet(to,from){
//         return (<div className="greeting">
//             Hello, {to} from
//             {from.map(name=><Name>{name}</Name>)}
//         </div>)
//     }
// }

// var b = (1+(2+(3+4)))*3
// new ConsoleGreeter().greetNTimes('World',{name:['Webstorm'],times:3})

// function*fibonacci(current=1,next=1){
//     yield current
//     yield*fibonacci(next,current+next)
// }

// let [first, second, ...rest] = take(fibonacci(...[1, 2, 3]), 10)

// function foo(x,y,z){
//     var i=0
//     var x={0:'zero',1:'one'}
//     var a=[0,1,2]
//     var foo = function({ a: [] }) {
//     }
//     var asyncFoo=async(x,y,z)=>{
//     }
//     var v=x.map(s=>s.length)
//     if(!i>10){
//         for(var j=0; j<10; j++){
//             switch(j){
//                 case 0:
//                     value='zero'
//                     break
//                 case 1:
//                     value='one'
//                     break
//             }
//             var c=j>5?'GT 5':'LE 5'
//         }
//     }else{
//         var j=0
//         try{
//             while(j<10){
//                 if(i==j||j>5){
//                     a[j]=i+j*12
//                 }
//                 i=(j<<2)&4
//                 j++
//             }
//             do{
//                 j--
//             }while(j>0)
//         }catch(e){
//             alert('Failure: '+e.message)
//         }finally{
//             reset(a,i)
//         }
//     }
// }
,
      checkList: [
      // before_parentheses
      "if", "for", "while", "catch", "function_expression",
      // around_operator
      "assignment_operator", "logical_operator", "equality_operator", "relational_operator", "bitwise_operator", "additive_operator", "additive_operator", "multiplicative_operator", "shift_operators", "unary_additive_operators", "arrow_function",
      // before_left_brace
      "function_left_brac", "if_left_brace", "else_left_brace", "for_left_brace", "while_left_brace", "do_left_brace", "switch_left_brace", "try_left_brace", "catch_left_brace", "finally_left_brace", "class_left_brace",
      // before_keywords
      "else_keyword", "while_keyword", "catch_keyword", "finally_keyword",
      // within
      "object_literal_braces", "es6_import_or_export_braces",
      // other
      "after_comma", "after_property_name_value_separator", "after_*_in_generator"
      ],
      ast: null,
      newCode: ''
    })

    const { indentConfig, spaceConfig, sourceCode, checkList, ast, newCode } = toRefs(state)

    const log = console.log.bind(console)
    const parse = (code) => {
        let ast = espree.parse(code, {
            ecmaVersion: "latest",
            // 指定要解析的脚本类型（“script”、“module”或“commonjs”）
            sourceType: "module",
            range: true,
            comments: true,
            attachComment: true,
            tokens: true,
            tolerant: true,
            ecmaFeatures: {
                // 启用 JSX 解析
                jsx: true,
                globalReturn: true
            }
        })
        return ast
    }

    const getConfig = () => {
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
    }

    const fillIndent = (count) => {
      log('count',count)
      log('indentConfig',indentConfig)
      // padStart 是在字符串前补全长度的方法，默认用空格补全
      return ''.padStart(count)
    }
    // 判断是否加空格
    const toggleSpace = (config) => {
      let s = state.checkList.includes(config) ? ' ' : ''
      return s
    }

    // 判断当前节点 indentCount 总数
    const initIndentCount = (indentCount) => {
      return indentCount === 0 ? 1 : indentCount + 1
    }

    // 处理 class 里的 body 的缩进逻辑
    const classAddIndent = (body, indentCount) => {
      // 此时 body 的 type 为 'ClassBody'，由 AST 可知 'ClassBody' 需要缩进
      body.indentCount = initIndentCount(indentCount)
      // 由 AST 可知，'ClassBody' 的 body 是数组，需要遍历里面内容
      let childBody = body.body
      childBody.forEach(item => {
        // 此时 b 的 type 为 'BlockStatement'，需要缩进
        let b = item.value.body
        b.indentCount = body.indentCount + 1
        // 'BlockStatement' 里的内容就递归调用 astAddIndentCount 计算
        astAddIndentCount(b.body, b.indentCount)
      })
    }

    // 为 ast 增加 indentCount 字段以计算每行缩进总数
    const astAddIndentCount = (astBody, indentCount = 0) => {
      astBody.forEach(item => {
        let type = item.type
        // 当节点 type 为 'ExportNamedDeclaration' 时，declaration.body 即是 'ClassBody'
        if (type === 'ExportNamedDeclaration') {
          let declaration = item.declaration
          classAddIndent(declaration.body, indentCount)
        } 
        // else if (type === 'ClassDeclaration') {
        //   classAddIndent(item, indentCount)
        // }
      })
      log('astBody',astBody)
    }

    const codeGen = (node) => {
        let indentConfig = state.indentConfig
        let type = node.type
        // log('type',type)
        if (type === 'Program') {
          let body = node.body
          let s = body.map(b => codeGen(b)).join('\n')
          return s
        } else if (type === 'ImportDeclaration') {
          let specifiers = node.specifiers
          let source = node.source
          // 引入用逗号分隔，所以返回结果 join(',')
          let s = specifiers.map(s => codeGen(s)).join(', ')
          let v = codeGen(source)
          // 检查是否勾选对应选项
          let es6_import_or_export_braces_space = toggleSpace('es6_import_or_export_braces')
          // 拼接返回内容
          let r = `import {${es6_import_or_export_braces_space}${s}${es6_import_or_export_braces_space}} from ${v}`
          return r
        } else if (type === 'ImportSpecifier') {
          let imported = node.imported
          let name = codeGen(imported)
          return name
        } else if (type === 'Identifier') {
            return node.name
        } else if (type === 'Literal' || type === 'JSXText') {
            return node.raw
        } else if (type === 'ExportNamedDeclaration') {
          let declaration = node.declaration
          let s = codeGen(declaration)
          let r = `export ${s}`
          return r
        } else if (type === 'ClassDeclaration') {
          let id = node.id
          let body = node.body
          let superClass = node.superClass
          let name = codeGen(id)
          let s = codeGen(body)
          let sc = codeGen(superClass)
          let r = sc ? `class ${name} extends ${sc} {\n${s}\n}` : `class ${name} {\n${s}\n}`
          return r
        } else if (type === 'ClassBody') {
          let body = node.body
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          body = body.map(e=> {
            let b = startSpace + codeGen(e)
            // let b = codeGen(e)
            log('b',b)
            return b
          }).join('\n')
          let r = `${body}`
          return r
        } else if (type === 'MethodDefinition') {
          let key = node.key
          let value = node.value
          let k = codeGen(key)
          let v= codeGen(value)
          let r = `${k} ${v}`
          return r
        } else if (type === 'FunctionExpression') {
          let expression = node.expression
          let generator = node.generator
          let async = node.async
          let params = node.params
          let body = node.body
          let p = params.map(p => codeGen(p)).join(', ')
          let b = codeGen(body)
          let r = `(${p}) ${b}`
          return r
        } else if (type === 'ObjectPattern') {
          let properties = node.properties
          let p = properties.map(p => codeGen(p)).join(', ')
          let r = `{${p}}`
          return r
        } else if (type === 'Property') {
          let key = node.key
          let value = node.value
          let k = codeGen(key)
          let v = codeGen(value)
          let r = k === v ? `${k}` : r = `${k}: ${v}`
          return r
        } else if (type === 'BlockStatement') {
          let body = node.body
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          let endSpace = fillIndent(indentConfig.indent * (node.indentCount - 1))
          let b = body.map(b => codeGen(b)).join(', ')
          let r = `{\n${startSpace}${b}\n${endSpace}}`
          return r
        } else if (type === 'ReturnStatement') {
          let argument = node.argument
          let a = codeGen(argument)
          let r = `return ${a}`
          return r
        } else if (type === 'JSXElement') {
          let openingElement = node.openingElement
          let closingElement = node.closingElement
          let children = node.children
          let open = codeGen(openingElement)
          let close = codeGen(closingElement) 
          let c = children.map(c => codeGen(c)).join('')
          let r = `(${open}${c}${close})`
          return r
        } else if (type === 'JSXOpeningElement') {
          let attributes = node.attributes
          let name = node.name
          let a = attributes.map(a => codeGen(a)).join(' ') || ''
          let n = codeGen(name)
          let as = a ? ` ${a}` : ''
          let r = node.selfClosing ? `<${n}${as} />` : `<${n}${as}>`
          log('r',r)
          return r
        } else if (type === 'JSXAttribute') {
          let name = node.name
          let value = node.value
          let n = codeGen(name)
          let v = codeGen(value)
          let r = `${n}=${v}`
          return r
        } else if (type === 'JSXIdentifier') {
          return node.name
        } else if (type === 'JSXClosingElement') {
          let name = node.name
          let n = codeGen(name)
          let r = `</${n}>`
          return r
        } else if (type === 'JSXExpressionContainer') {
          let expression = node.expression
          let e = codeGen(expression)
          let r = `{${e}}`
          return r
        } else if (type === 'TemplateLiteral') {
          let expressions = node.expressions
          let quasis = node.quasis
          let e = expressions.map(e => codeGen(e))
          let q = quasis.map(q => codeGen(q))
          // e 拼接一个空字符串，用于遍历 quasis
          e.concat('')
          let s = ''
          for (let i = 0; i < e.length; i++) {
            s += q[i] + '${'+ e[i] + '}'
          }
          let r = `\`${s}\``
          return r
        } else if (type === 'TemplateElement') {
          return node.value.raw
        } else if (type === 'CallExpression') {
          let callee = node.callee
          let args = node.arguments
          let c = codeGen(callee)
          let a = args.map(a => codeGen(a)).join(', ')
          let r = `${c}(${a})`
          return r
        } else if (type === 'ArrowFunctionExpression') {
          let params = node.params
          let body = node.body
          let p = params.map(p => codeGen(p)).join(', ')
          let b = codeGen(body)
          let r = `${p}=>${b}`
          return r
        } else if (type === 'MemberExpression') {
          let object = node.object
          let property = node.property
          let o = codeGen(object)
          let p = codeGen(property)
          let r = `${o}.${p}`
          return r
        } else if (type === 'ThisExpression') {
          return 'this'
        } else if (type === 'VariableDeclaration') {
          let declarations = node.declarations
          let kind = node.kind
          let d = declarations.map(d => codeGen(d)).join(', ')
          let r = `${kind} ${d}`
          return r
        } else if (type === 'VariableDeclarator') {
          let id = node.id
          let init = node.init
          let name = codeGen(id)
          let i = codeGen(init)
          let r = `${name} = ${i}`
          return r
        } else if (type === 'BinaryExpression') {
          let left = node.left
          let operator = node.operator
          let right = node.right
          let l = codeGen(left)
          let r = codeGen(right)
          let s = `(${l}${operator}${r})`
          return s
        } else if (type === 'ExpressionStatement') {
          let expression = node.expression
          let e = codeGen(expression)
          return e
        } else if (type === 'CallExpression') {
          let callee = node.callee
          let args = node.arguments
          let c = codeGen(callee)
          let a = codeGen(args)
          let r = `${c}(${a})`
          return r
        } else if (type === 'MemberExpression') {
          let object = node.object
          let property = node.property
          let o = codeGen(object)
          let p = codeGen(property)
          let r = `${o}.${p}`
          return r
        } else if (type === 'NewExpression') {
          let callee = node.callee
          let args = node.arguments
          let c = codeGen(callee)
          let a = args.length ? codeGen(args) : ''
          let r = `New ${c}(${a})`
          return r
        } else if (type === 'ObjectExpression') {
          let properties = node.properties
          let p = properties.map(p => codeGen(p)).join(', ')
          let r = `${p}`
          return r
        } else if (type === 'ArrayExpression') {
          let elements = node.elements
          let e = elements.map(e => codeGen(e)).join(', ')
          let r = `[${e}]`
          return r
        }
    }

    onMounted(() => {
      state.ast = parse(state.sourceCode)
      log('state.ast',state.ast)
      astAddIndentCount(state.ast.body)
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
      // log('state.newCode',state.newCode)
    })

    return {
      indentConfig,
      spaceConfig,
      sourceCode,
      checkList,
      ast,
      newCode,
      log,
      parse,
      getConfig,
      fillIndent,
      toggleSpace,
      initIndentCount,
      classAddIndent,
      astAddIndentCount,
      codeGen
    }
  },
  components: {
    ElInputNumber,
    ElCheckboxGroup,
    ElCheckbox
  },
}
</script>
<style scoped>
.main {
  display: flex;
  height: 95vh;
}
.options {
  color: #333;
  width: 20%;
  overflow-y: auto;
  border: 1px solid #333;
  margin-right: 10px;
  padding: 10px;
}
.options .block {
  display: flex;
  flex-direction: column;
}
.indent {
  display: flex;
  align-items: center;
}
.category {
  font-size: 18px;
  font-weight: bold;
  margin-right: 1rem;
}
.source textarea {
  width: 100%;
  height: 100%;
  border: none;
}
.panel, .source {
  overflow: scroll;
  border: 1px solid #333;
  margin-right: 10px;
}
.panel {
  width: 50%;
}
.source {
  width: 30%;
}
pre {
  margin: 0;
}
</style>
