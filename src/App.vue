<template>
  <div class="main">
    <!-- 格式化选项 -->
    <div class="options">
      <div class="list" v-for="(value, name, index) in spaceConfig" :key="index">
        <el-checkbox-group v-model="checkList">
        <div class="category" data-action="toggle-item">
          {{name}}
          <!-- <span class="fold" data-action="toggle-item">-</span> -->
        </div>
        <div class="block">
          <el-checkbox class="option" v-for="(v, n, i) in value" :key="i" :label="n" @change="changeOptions" />
        </div>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 源代码 -->
    <div class="source">
      <textarea v-model="sourceCode"></textarea>
    </div>
    <!-- 格式化效果 -->
    <div class="panel">
      <highlightjs language="javascript" :code="sourceCode" />
    </div>
  </div>
</template>

<script>
import * as espree from "espree"
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { onBeforeMount, onMounted, reactive, ref, toRefs } from "vue"
export default {
  setup() {
    const state = reactive({
      indentConfig: {
          indent: 4,
      },
      spaceConfig: {
          before_parentheses: {
              // 函数定义
              function_declaration: false,
              // 函数调用
              function_call: false,
              if: true,
              for: true,
              while: true,
              switch: false,
              catch: true,
              function_expression: true,
              async_arrow_function: false,
          },
          around_operator: {
              // =, +=, -=
              assignment_operator: true,
              // &&, ||
              logical_operator: true,
              // ==, !=, '===', '!=='
              equality_operator: true,
              // <, >, <=
              relational_operator: true,
              // &, |, ^
              bitwise_operator: true,
              // +, -,
              additive_operator: true,
              // *, /, %
              multiplicative_operator: true,
              // <<, >>, >>>
              shift_operators: true,
              // +, -, ++, --
              unary_additive_operators: true,
              // =>
              arrow_function: true,
              // !, !!
              before_unary: false,
              // !, !!
              after_unary: false,
          },
          before_left_brace: {
              function_left_brace: true,
              if_left_brace: true,
              else_left_brace: true,
              for_left_brace: true,
              while_left_brace: true,
              do_left_brace: true,
              switch_left_brace: true,
              try_left_brace: true,
              catch_left_brace: true,
              finally_left_brace: true,
              class_left_brace: true,
          },
          before_keywords: {
              else_keyword: true,
              while_keyword: true,
              catch_keyword: true,
              finally_keyword: true,
          },
          within: {
              index_access_brackets: false,
              grouping_parentheses: false,
              function_declaration_parentheses: false,
              function_call_parentheses: false,
              if_parentheses: false,
              for_parentheses: false,
              while_parentheses: false,
              switch_parentheses: false,
              catch_parentheses: false,
              object_literal_braces: true,
              es6_import_or_export_braces: true,
              array_brackets: false,
              interpolation_expressions: false,
          },
          in_ternary_operator: {
              'before_?': false,
              'after_?': false,
              'before_:': false,
              'after_:': false,
          },
          other: {
              before_comma: false,
              after_comma: true,
              before_for__semicolon: false,
              before_property_name_value_separator: false,
              after_property_name_value_separator: true,
              'after_..._in_rest_or_spread': false,
              'before_*_in_generator': false,
              'after_*_in_generator': true,
          },
      },
      sourceCode: `
      import {Component} from 'react'

      export class Greeter{
          greetNTimes(to,{from,times}){
              return range(times).map(item=>this.greet(to,from))
          }
      }sx

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

          `,
      checkList: []
    })

    const { indentConfig, spaceConfig, sourceCode, checkList } = toRefs(state)

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
        log('ast',ast)
        return ast
    }

    const changeOptions = () => {
      log('checkList===',state.checkList)
    }

    onBeforeMount(() => {
      Object.keys(state.spaceConfig).forEach(key => {
        Object.keys(state.spaceConfig[key]).forEach(k => {
          if(state.spaceConfig[key][k]) {
            state.checkList.push(k)
          }
        })
      })
      log('checkList',state.checkList)
    })

    onMounted(() => {
      log('sourceCode',state.sourceCode)
      parse(state.sourceCode)
    })

    return {
      indentConfig,
      spaceConfig,
      sourceCode,
      checkList,
      log,
      parse,
      changeOptions
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
  color:dodgerblue;
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
