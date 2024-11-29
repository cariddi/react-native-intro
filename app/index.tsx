import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { FlatList, LayoutAnimation, StyleSheet, Text, TextInput, View } from 'react-native';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { theme } from "../theme";
import { STORAGE_KEY_SHOPPING_LIST } from '../utils/const';
import { orderShoppingList } from '../utils/list';
import { getFromStorage, saveToStorage } from "../utils/storage";
import { ShoppingListItemType } from '../utils/types';

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", lastUpdatedTimestamp: Date.now() },
  { id: "2", name: "Tea", lastUpdatedTimestamp: Date.now() },
  { id: "3", name: "Milk", lastUpdatedTimestamp: Date.now() },
];

export default function App() {
  const [shoppingList, setShoppingList] = useState(initialList)
  const [value, setValue] = useState<string>()

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(STORAGE_KEY_SHOPPING_LIST)
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setShoppingList(data)
      }
    };

    fetchInitial();
  }, [])

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: new Date().toISOString(),
          name: value,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ]

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setShoppingList(newShoppingList)
      saveToStorage(STORAGE_KEY_SHOPPING_LIST, newShoppingList)
      setValue(undefined)
    }
  }

  const handleDeleteItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const newShoppingList = shoppingList.filter((item) => item.id !== id)
    setShoppingList(newShoppingList)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    saveToStorage(STORAGE_KEY_SHOPPING_LIST, newShoppingList)
  }

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      } else {
        return item;
      }
    })

    saveToStorage(STORAGE_KEY_SHOPPING_LIST, newShoppingList)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShoppingList(newShoppingList)
  };

  return (
    <FlatList
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          value={value}
          style={styles.textInput}
          onChangeText={setValue}
          placeholder="E.g Coffee"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      data={orderShoppingList(shoppingList)}
      renderItem={({ item }) => <ShoppingListItem
        name={item.name}
        id={item.id}
        onDelete={() => handleDeleteItem(item.id)}
        onToggleComplete={() => handleToggleComplete(item.id)}
        isCompleted={Boolean(item.completedAtTimestamp)}
      />}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    ></FlatList>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    fontSize: 18,
    borderRadius: 50,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
