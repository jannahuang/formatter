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
              "function_left_brace",
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
import {Component,Message} from 'react'

export class Greeter{
    greetNTimes(to,{from,times}){
        return range(times).map(item=>this.greet(to,from))
    }
}

export class ConsoleGreeter extends Greeter {
    greet (to, from) {
        return \`Hello, \${to} from \${from.join(',')}\`
    }
}

export class ReactGreeter extends Greeter{
    greet(to,from){
        return (<div className="greeting">
            Hello, {to} from
            {from.map(name=><Name>{name}</Name>)}
        </div>)
    }
}

var b = (1+(2+(3+4)))*3
new ConsoleGreeter().greetNTimes('World',{name:['Webstorm'],times:3})

function*fibonacci(current=1,next=1){
    yield current
    yield*fibonacci(next,current+next)
}

let [first, second, ...rest] = take(fibonacci(...[1, 2, 3]), 10)

function foo(x,y,z){
    var i=0
    var x={0:'zero',1:'one'}
    var a=[0,1,2]
    var foo = function({ a: [] }) {
    }
    var asyncFoo=async(x,y,z)=>{
    }
    var v=x.map(s=>s.length)
    if(!i>10){
        for(var j=0; j<10; j++){
            switch(j){
                case 0:
                    value='zero'
                    break
                case 1:
                    value='one'
                    break
            }
            var c=j>5?'GT 5':'LE 5'
        }
    }else{
        var j=0
        try{
            while(j<10){
                if(i==j||j>5){
                    a[j]=i+j*12
                }
                i=(j<<2)&4
                j++
            }
            do{
                j--
            }while(j>0)
        }catch(e){
            alert('Failure: '+e.message)
        }finally{
            reset(a,i)
        }
    }
}
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
      "function_left_brace", "if_left_brace", "else_left_brace", "for_left_brace", "while_left_brace", "do_left_brace", "switch_left_brace", "try_left_brace", "catch_left_brace", "finally_left_brace", "class_left_brace",
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

    // 处理 if 里的 body 的缩进逻辑
    const ifAddIndent = (node, indentCount) => {
      let alternate = node.alternate
      let consequent = node.consequent
      consequent.indentCount = initIndentCount(indentCount)
      let body = consequent.body
      if (body.length) {
        astAddIndentCount(body, consequent.indentCount)
      }
      if (alternate) {
        if (alternate.type === 'BlockStatement') {
          alternate.indentCount = initIndentCount(indentCount)
          let b = alternate.body
          if (b.length) {
            astAddIndentCount(b, alternate.indentCount)
          }
        } else if (alternate.type === 'IfStatement') {
          ifAddIndent(alternate, indentCount)
        }
      }
    }

    // 为 ast 增加 indentCount 字段以计算每行缩进总数
    const astAddIndentCount = (astBody, indentCount = 0) => {
      astBody.forEach(item => {
        let type = item.type
        // 当节点 type 为 'ExportNamedDeclaration' 时，declaration.body 即是 'ClassBody'
        if (type === 'ExportNamedDeclaration') {
          let declaration = item.declaration
          classAddIndent(declaration.body, indentCount)
        } else if (type === 'ClassDeclaration') {
          classAddIndent(item, indentCount)
        } else if (type === 'FunctionDeclaration') {
          let body = item.body
          if (body != undefined) {
            body.indentCount = initIndentCount(indentCount)
            let b = body.body
            if (b.length) {
              astAddIndentCount(b, body.indentCount)
            }
          }
        } else if (type === 'VariableDeclaration') {
          let declarations = item.declarations
          if (declarations.length) {
            declarations.forEach(d => {
              if(d.init) {
                let body = d.init.body
                if (body) {
                  body.indentCount = initIndentCount(indentCount)
                  let b = body.body
                  if(b.length) {
                    astAddIndentCount(b, indentCount)
                  }
                }
              }
            })
          }
        } else if (type === 'IfStatement') {
          ifAddIndent(item, indentCount)
        } else if (type === 'ForStatement') {
              let body = item.body
              if (body) {
                body.indentCount = initIndentCount(indentCount)
                let b = body.body
                if (b.length) {
                    astAddIndentCount(b, body.indentCount)
                }
              }
          } else if (type === 'SwitchStatement') {
              item.indentCount = initIndentCount(indentCount)
            let cases = item.cases
            if (cases.length) {
                astAddIndentCount(cases, item.indentCount)
            }
          } else if (type === 'SwitchCase') {
              item.indentCount = initIndentCount(indentCount)
              let consequent = item.consequent
              if (consequent.length) {
                  astAddIndentCount(consequent, item.indentCount)
              }
          } else if (type === 'TryStatement') {
            let block = item.block
            block.indentCount = initIndentCount(indentCount)
            let body = block.body
            if (body.length) {
              astAddIndentCount(body, block.indentCount)
            }
            let handler = item.handler
            let hb = handler.body
            hb.indentCount = initIndentCount(indentCount)
            let hcb = hb.body
            if (hcb.length) {
              astAddIndentCount(hcb, hb.indentCount)
            }
            let finalizer = item.finalizer
            finalizer.indentCount = initIndentCount(indentCount)
            let fb = finalizer.body
            if (fb.length) {
              astAddIndentCount(fb, finalizer.indentCount)
            }
          } else if (type === 'WhileStatement') {
            let body = item.body
            body.indentCount = initIndentCount(indentCount)
            let b = body.body
            if (b.length) {
              astAddIndentCount(b, body.indentCount)
            }
          } else if (type === 'DoWhileStatement') {
            let body = item.body
            body.indentCount = initIndentCount(indentCount)
            let b = body.body
            if (b.length) {
              astAddIndentCount(b, body.indentCount)
            }
          }
      })
      // log('astBody',astBody)
    }

    const codeGen = (node) => {
        let indentConfig = state.indentConfig
        let type = node.type
        // log('type',type)
        if (type === 'Program') {
          let body = node.body
          let s = body.map(b => codeGen(b)).join('\n\n')
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
          let s
          let r
          if(declaration) {
            s = codeGen(declaration)
            r = `export ${s}`
          }
          return r
        } else if (type === 'ClassDeclaration') {
          let id = node.id
          let body = node.body
          let superClass = node.superClass
          let name = codeGen(id)
          let s = codeGen(body)
          let sc = ''
          if (superClass) {
            sc = codeGen(superClass)
          }
          let class_left_brace = toggleSpace('class_left_brace')
          let r = sc ? `class ${name} extends ${sc}${class_left_brace}{\n${s}\n}` : `class ${name}${class_left_brace}{\n${s}\n}`
          return r
        } else if (type === 'ClassBody') {
          let body = node.body
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          body = body.map(e=> {
            let b = startSpace + codeGen(e)
            return b
          }).join('\n')
          let r = `${body}`
          return r
        } else if (type === 'MethodDefinition') {
          let key = node.key
          let value = node.value
          let k = codeGen(key)
          let v= codeGen(value)
          let function_declaration = toggleSpace('function_declaration')
          let r = `${k}${function_declaration}${v}`
          return r
        } else if (type === 'FunctionExpression') {
          let expression = node.expression
          let generator = node.generator
          let async = node.async
          let params = node.params
          let body = node.body
          let p = params.map(p => codeGen(p)).join(', ')
          let b = codeGen(body)
          let function_expression = toggleSpace('function_expression')
          let function_left_brace = toggleSpace('function_left_brace')
          let function_declaration_parentheses = toggleSpace('function_declaration_parentheses')
          let r = `${function_expression}(${function_declaration_parentheses}${p}${function_declaration_parentheses})${function_left_brace}${b}`
          return r
        } else if (type === 'ObjectPattern') {
          let properties = node.properties
          let p = properties.map(p => codeGen(p)).join(', ')
          let object_literal_braces = toggleSpace('object_literal_braces')
          let r = `{${object_literal_braces}${p}${object_literal_braces}}`
          return r
        } else if (type === 'Property') {
          let key = node.key
          let value = node.value
          let k = codeGen(key)
          let v = codeGen(value)
          let r = k === v ? `${k}` : `${k}: ${v}`
          return r
        } else if (type === 'BlockStatement') {
          let body = node.body
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          let endSpace = fillIndent(indentConfig.indent * (node.indentCount - 1))
          let b = body.length ? body.map(b => {
            return startSpace + codeGen(b)
          }).join('\n') + '\n': ''
          let r = `{\n${b}${endSpace}}`
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
          let grouping_parentheses = toggleSpace('grouping_parentheses')
          let r = `(${grouping_parentheses}${open}${c}${close}${grouping_parentheses})`
          return r
        } else if (type === 'JSXOpeningElement') {
          let attributes = node.attributes
          let name = node.name
          let a = attributes.map(a => codeGen(a)).join(' ') || ''
          let n = codeGen(name)
          let as = a ? ` ${a}` : ''
          let r = node.selfClosing ? `<${n}${as} />` : `<${n}${as}>`
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
          let function_call = toggleSpace('function_call')
          let function_call_parentheses = toggleSpace('function_call_parentheses')
          let r = `${c}${function_call}(${function_call_parentheses}${a}${function_call_parentheses})`
          return r
        } else if (type === 'ArrowFunctionExpression') {
          let params = node.params
          let body = node.body
          let p = params.map(p => codeGen(p)).join(', ')
          let b = codeGen(body)
          let async_arrow_function = toggleSpace('async_arrow_function')
          let arrow_function = toggleSpace('arrow_function')
          let r = `async${async_arrow_function}(${p})${arrow_function}=>${arrow_function}${b}`
          return r
        } else if (type === 'MemberExpression') {
          let object = node.object
          let property = node.property
          let computed = node.computed
          let o = codeGen(object)
          let p = codeGen(property)
          let index_access_brackets = toggleSpace('index_access_brackets')
          let r = computed ? `${o}[${index_access_brackets}${p}${index_access_brackets}]`:`${o}.${p}`
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
          let binary_operator = ''
          if (['==','!=','===','!=='].includes(operator)) {
            binary_operator = toggleSpace('equality_operator')
          } else if (['<', '>', '<=', '>='].includes(operator)) {
            binary_operator = toggleSpace('relational_operator')
          } else if (['%', '|', '^'].includes(operator)) {
            binary_operator = toggleSpace('bitwise_operator')
          } else if (['+', '-'].includes(operator)) {
            binary_operator = toggleSpace('additive_operator')
          } else if (['*', '/', '%'].includes(operator)) {
            binary_operator = toggleSpace('multiplicative_operator')
          } else if (['<<', '>>', '>>>'].includes(operator)) {
            binary_operator = toggleSpace('shift_operators')
          }
          let s = `(${l}${binary_operator}${operator}${binary_operator}${r})`
          return s
        } else if (type === 'ExpressionStatement') {
          let expression = node.expression
          let e = codeGen(expression)
          return e
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
          let r = `{${p}}`
          return r
        } else if (type === 'ArrayExpression') {
          let elements = node.elements
          let e = elements.map(e => codeGen(e)).join(', ')
          let r = `[${e}]`
          return r
        } else if (type === 'FunctionDeclaration') {
          let id = node.id
          let expression = node.expression
          let generator = node.generator
          let async = node.async
          let params = node.params
          let body = node.body
          let name = codeGen(id)
          let p = params.map(p => codeGen(p)).join(',')
          let b = codeGen(body)
          let r = `function ${generator?'*':''}${name}(${p})${b}`
          return r
        } else if (type === 'AssignmentPattern') {
          let left = node.left
          let right = node.right
          let l = codeGen(left)
          let r = codeGen(right)
          let assignment_operator = toggleSpace('assignment_operator')
          let s = `${l}${assignment_operator}=${assignment_operator}${r}`
          return s
        } else if (type === 'ExpressionStatement') {
          let expression = node.expression
          let e = codeGen(expression)
          let r = `${e}`
          return r
        } else if (type === 'YieldExpression') {
          let args = node.argument
          let a = codeGen(args)
          let r = `yield ${a}`
          return r
        } else if (type === 'ArrayPattern') {
          let elements = node.elements
          let e = elements.map(e => codeGen(e)).join(', ')
          let r = `[${e}]`
          return r 
        } else if (type === 'RestElement') {
          let arg = node.argument
          let a = codeGen(arg)
          let r = `...${a}`
          return r
        } else if (type === 'SpreadElement') {
          let arg = node.argument
          let a = codeGen(arg)
          let r = `...${a}`
          return r
        } else if (type === 'IfStatement') {
          let test = node.test
          let consequent = node.consequent
          let alternate = node.alternate
          let t = codeGen(test)
          let c = codeGen(consequent)
          let a = alternate ? codeGen(alternate) : ''
          let if_space = toggleSpace('if')
          let if_left_brace = toggleSpace('if_left_brace')
          let else_left_brace = toggleSpace('else_left_brace')
          let else_keyword = toggleSpace('else_keyword')
          let if_parentheses = toggleSpace('if_parentheses')
          let r = `if${if_space}${t}${if_left_brace}${c}${alternate?else_keyword+'else'+else_left_brace+a : ''}`
          return r
        } else if (type === 'UnaryExpression') {
          let operator = node.operator
          let prefix = node.prefix
          let argument = node.argument
          let a = codeGen(argument)
          let before_unary = toggleSpace('before_unary')
          let after_unary = toggleSpace('after_unary')
          let r = `${before_unary}${operator}${after_unary}${a}`
          return r
        } else if (type === 'ForStatement') {
          let init = node.init
          let test = node.test
          let update = node.update
          let body = node.body
          let i = codeGen(init)
          let t = codeGen(test)
          let u = codeGen(update)
          let b = codeGen(body)
          let for_space = toggleSpace('for')
          let for_left_brace = toggleSpace('for_left_brace')
          let for_parentheses = toggleSpace('for_parentheses')
          let r = `for${for_space}(${for_parentheses}${i}; ${t}; ${u}${for_parentheses})${for_left_brace}${b}`
          return r
        } else if (type === 'UpdateExpression') {
          let operator = node.operator
          let prefix = node.prefix
          let argument = node.argument
          let a = codeGen(argument)
          let unary_additive_operators = ''
          if (['+', '-', '++', '--'].includes(operator)) {
            unary_additive_operators = toggleSpace('unary_additive_operators')
          }
          let r = `${a}${unary_additive_operators}${operator}`
          return r
        }else if (type === 'SwitchStatement') {
          let discriminant = node.discriminant
          let cases = node.cases
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          let endSpace = fillIndent(indentConfig.indent * (node.indentCount - 1))
          let d = codeGen(discriminant)
          let c = cases.map(c => {
            return startSpace + codeGen(c)
          }).join('\n')
          let switch_space = toggleSpace('switch')
          let switch_left_brace = toggleSpace('switch_left_brace')
          let switch_parentheses = toggleSpace('switch_parentheses')
          let r = `switch${switch_space}(${switch_parentheses}${d}${switch_parentheses})${switch_left_brace}{\n${c}\n${endSpace}}`
          return r
        } else if (type === 'SwitchCase') {
          let consequent = node.consequent
          let test = node.test
          let startSpace =  fillIndent(indentConfig.indent * node.indentCount)
          let endSpace = fillIndent(indentConfig.indent * (node.indentCount - 1))
          let c = consequent.map(c => {
            return startSpace + codeGen(c)
          }).join('\n')
          let t = codeGen(test)
          let r = `case ${t}:\n${c}`
          return r
        } else if (type === 'AssignmentExpression') {
          let operator = node.operator
          let left = node.left
          let right = node.right
          let l = codeGen(left)
          let r = codeGen(right)
          let s = `${l}${operator}${r}`
          return s
        } else if (type === 'BreakStatement') {
          return 'break'
        } else if (type === 'ConditionalExpression') {
          let test = node.test
          let consequent = node.consequent
          let alternate = node.alternate
          let t = codeGen(test)
          let c = codeGen(consequent)
          let a = codeGen(alternate)
          let r = `${t}?${c}:${a}`
          return r
        } else if (type === 'TryStatement') {
          let block = node.block
          let handler = node.handler
          let finalizer = node.finalizer
          let b = codeGen(block)
          let h = codeGen(handler)
          let f = codeGen(finalizer)
          let try_left_brace = toggleSpace('try_left_brace')
          let finally_left_brace = toggleSpace('finally_left_brace')
          let finally_keyword = toggleSpace('finally_keyword')
          let r = `try${try_left_brace}${b}${h}${finally_keyword}finally${finally_left_brace}${f}`
          return r
        } else if (type === 'WhileStatement') {
          let test = node.test
          let body = node.body
          let t = codeGen(test)
          let b = codeGen(body)
          let while_space = toggleSpace('while')
          let while_left_brace = toggleSpace('while_left_brace')
          let while_parentheses = toggleSpace('while_parentheses')
          let r = `while${while_space}(${while_parentheses}${t}${while_parentheses})${while_left_brace}${b}`
          return r
        } else if (type === 'DoWhileStatement') {
          let test = node.test
          let body = node.body
          let t = codeGen(test)
          let b = codeGen(body)
          let while_space = toggleSpace('while')
          let do_left_brace = toggleSpace('do_left_brace')
          let while_keyword = toggleSpace('while_keyword')
          let r = `do${do_left_brace}${b}${while_keyword}while${while_space}${t}`
          return r
        } else if (type === 'CatchClause') {
          let param = node.param
          let body = node.body
          let p = codeGen(param)
          let b = codeGen(body)
          let catch_space = toggleSpace('catch')
          let catch_left_brace = toggleSpace('catch_left_brace')
          let catch_keyword = toggleSpace('catch_keyword')
          let catch_parentheses = toggleSpace('catch_parentheses')
          let r = `${catch_keyword}catch${catch_space}(${catch_parentheses}${p}${catch_parentheses})${catch_left_brace}${b}`
          return r
        } else if (type === 'LogicalExpression') {
          let operator = node.operator
          let left = node.left
          let right = node.right
          let l = codeGen(left)
          let r = codeGen(right)
          let logical_operator = toggleSpace('logical_operator')
          let s = `(${l}${logical_operator}${operator}${logical_operator}${r})`
          return s
        }
    }

    onMounted(() => {
      state.ast = parse(state.sourceCode)
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
      ifAddIndent,
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
