
import { SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { Text,  View, StyleSheet, Image, Alert} from "react-native";
import React, {useEffect, useState} from 'react';
import {s} from "./app.style";

import { Header } from "./components/Header";
import { CardTodo } from "./components/CardTodo/CardTodo";
import react from "react";
import { render } from "react-dom";
import { ScrollView } from "react-native"; 
import { TabBottomMenu } from "./components/TabBottomMenu/TabBottomMenu";
import { ButtonAdd } from "./components/ButtonAdd/ButtonAdd";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  uuid from "react-native-uuid";






let isFirstRender = true;
let isLoadUpdate = false;
export default function App() {
  const [ selectedTabName, setselectedTabName] = useState("all");
  const [todoList, setTodoList] = useState([5]);
  const [isAddDialogVisible, setIsAddDialogVisible]= useState (false);
  const [inputValue, setInputValue] =  useState("5");

  useEffect(() => {
    loadTodoList();
  }, []);
  useEffect(() => {
    if(loadTodoList){
      isLoadUpdate = false;

    } else {

    if(!isFirstRender){
      saveTodoList();
    } else {
      isFirstRender = false;
    }
  }
  }, [todoList]);
  
  async function saveTodoList(){
    console.log("SAVE")
    try{
      await AsyncStorage.setItem("@todoList", JSON.stringify(todoList))
    } catch (err){
      alert("Erreur" + err);

    }
  }
  async function loadTodoList(){
    console.log("LOAD")
    try{
      const stringifiedTodoList = await AsyncStorage.getItem("@todoList");
      if (stringifiedTodoList !==  null) {
        const parsedTodoList = JSON.parse(stringifiedTodoList);
        isLoadUpdate =  true;
        setTodoList(parsedTodoList);
      }
    } catch (err){
      alert("Erreur" + err);

    }

  }

  function getFiltredList(){
    switch(selectedTabName){
      case "all":
        return todoList
      case "inProgress":
        return todoList.filter(todo => !todo.isCompleted)
        case "done":
        return todoList.filter(todo => todo.isCompleted)
    }
  }
  function updateTodo( todo ) {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };

    const indexToUpdate = todoList.findIndex(
    (todo) => todo.id === updatedTodo.id
    );

    const updatedTodoList = [...todoList];
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }
    function deleteTodo(todoToDelete){
      Alert.alert("Superssion", "Voulez vous supprimé cette tache?", [
{
text:"Suuprimer",
style:"destructive",
onPress:()=>{
  setTodoList(todoList.filter(todo => todo.id !==todoToDelete.id));
  setInputValue(false);
  
},

},
{
  text: "Annuler",
  style:"cancel",
},


      ]);

    }
  
    function renderTodoList(){
      return getFiltredList().map((todo) => (
      <View style={s.cardItem} key={todo.id}>
        <CardTodo onLongPress={deleteTodo} onPress= {updateTodo} todo={todo} />
        </View>
        ));
      }

  function showAddDialog(){
setIsAddDialogVisible(true);
  }
  function addTodo(){
    
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
    setIsAddDialogVisible(false);

  }
  return (
    <>
  <SafeAreaProvider>
    <SafeAreaView style={s.app}>
      <View style={s.header}>
        <Header />
        </View>    
        <View style={s.body}>
          <ScrollView>{renderTodoList()}</ScrollView>
          </View>   
          <ButtonAdd onPress={showAddDialog}/>
          
        
      </SafeAreaView>
    </SafeAreaProvider>
    
      <TabBottomMenu  
      todoList={todoList}
      onPress={setselectedTabName}
      selectedTabName={selectedTabName}/>
      <Dialog.Container visible={isAddDialogVisible} onBackdropPress={() =>setIsAddDialogVisible(false)}>
        <Dialog.Title>Créer une Tache</Dialog.Title>
          <Dialog.Description>Je prècise ma tache à faire </Dialog.Description>
            <Dialog.Input onChangeText={setInputValue}/>
              <Dialog.Button disabled={inputValue.length === 0} label="Ajouter/Crèer" onPress={addTodo}/>

              
            
          
        
      </Dialog.Container>
    </>
);
} 