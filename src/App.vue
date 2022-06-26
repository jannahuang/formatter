<template>
  <div class="main">
    <!-- 格式化选项 -->
    <div class="options">
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
      <textarea v-model="sourceCode"></textarea>
    </div>
    <!-- 格式化效果 -->
    <div class="panel">
      <highlightjs language="javascript" :code="newCode" />
    </div>
  </div>
</template>

<script>
import * as espree from "espree"
import 'element-plus/es/components/checkbox/style/css'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
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
import {Component} from 'react'
`
// export class Greeter{
//     greetNTimes(to,{from,times}){
//         return range(times).map(item=>this.greet(to,from))
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
      log('checkList===',state.checkList)
      log('spaceConfig',state.spaceConfig)
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
    }

    const toggleSpace = (config) => {
      let s = state.checkList.includes(config) ? ' ' : ''
      return s
    }

    const codeGen = (node) => {
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
          log('es6_import_or_export_braces_space',`(${es6_import_or_export_braces_space})`)
          // 拼接返回内容
          let r = `import {${es6_import_or_export_braces_space}${s}${es6_import_or_export_braces_space}} from ${v}`
          return r
        } else if (type === 'ImportSpecifier') {
          let imported = node.imported
          let name = codeGen(imported)
          return name
        } else if (type === 'Identifier') {
            return node.name
        } else if (type === 'Literal') {
            return node.raw
        } else if (type === 'ExportNamedDeclaration') {
          let declaration = node.declaration
          let specifiers = node.specifiers
          let source = node.source
          log('declaration',declaration)
          if (declaration !== null) {
              let s = codeGen(declaration)
              let r = `export ${s}`
              return r
          }
        } else if (type === 'ClassDeclaration') {
          let body = node.body
          let s = codeGen(body)
          // let s = `${body}`
          let r = `${s}`
          return r
        } else if (type === 'ClassBody') {
          let body = node.body
          // let s = body.map(b => codeGen(b))
          body = body.map(e => codeGen(e)).join('\n')
          let s = `${body}`
          let r = `${s}`
          return r
        } else if (type === 'MethodDefinition') {
          log('MethodDefinition')
          let key = node.key
          let name = codeGen(key)
          let value = node.value
          log('value****',value)
          value = codeGen(value)
          log('name===',name)
          log('value===',value)
          let function_declaration_space = toggleSpace('function_declaration')
          log('function_declaration_space===',`(${function_declaration_space})`)
          return `${name}${function_declaration_space}${value}`
        } else if (type === 'FunctionExpression') {
          log('')

        } else if (type === 'VariableDeclaration') {
            let ds = node.declarations
            let s1 = ds.map(d => codeGen(d)).join(', ')
            let kind = node.kind
            let r = `${kind} ${s1}`
            return r
        } else if (type === 'VariableDeclarator') {
            let id = node.id
            let init = node.init

            id = codeGen(id)
            init = codeGen(init)
            let s = `${id} = ${init}`
            return s
        }
    }

    onMounted(() => {
      state.ast = parse(state.sourceCode)
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
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
      toggleSpace,
      codeGen
    }
  },
  components: {
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
.category {
  font-size: 18px;
  font-weight: bold;
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
