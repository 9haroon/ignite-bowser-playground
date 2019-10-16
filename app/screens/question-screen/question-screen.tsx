import React, {useState, useEffect} from "react"
import { observer, inject } from "mobx-react"
import { ViewStyle, View, FlatList, TextStyle, Alert, TouchableOpacity } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { QuestionStore } from "../../models/question-store"
//import { Button } from "../../components/button"
import { Question } from "../../models/question"
import { useStores } from '../../models/root-store'

export interface QuestionScreenProps extends NavigationScreenProps<{}> {
  questionStore: QuestionStore
}

export interface QuestionScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.medium,
  backgroundColor: color.palette.angry,
  marginTop: spacing.medium,
}

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
}
export const QuestionScreen: React.FunctionComponent<QuestionScreenProps> = (observer((props)=>{
  const { questionStore } = useStores()
  const { questions } = questionStore
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(()=>{
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    if(refreshing) return;
    setRefreshing(true)
    questionStore.getQuestions().then(()=>setRefreshing(false))
    
  }
  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
      </View>
    )
  }

  return (
      <Screen style={ROOT} preset="fixed">
        <View style={HEADER_CONTAINER}>
          <Text preset="header" tx="questionScreen.header" />
        </View>
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
          onRefresh={fetchQuestions}
          refreshing={refreshing}
        />
      </Screen>
  )
  
}))
/*@inject("questionStore")
@observer
export class QuestionScreen extends React.Component<QuestionScreenProps, QuestionScreenState> {
  state = {
    refreshing: false,
  }

  componentDidMount() {
    this.fetchQuestions()
    console.log('didMount', useStores())
  }

  fetchQuestions = () => {
    this.setState({ refreshing: true })
    this.props.questionStore.getQuestions()
    this.setState({ refreshing: false })
  }


  renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index: number) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}

    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={answer} />
      </TouchableOpacity>
    )
  }

  renderQuestion = ({ item }) => {
    const question: Question = item

    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
      </View>
    )
  }
  render() {
    //const { questionStore } = this.props
    const { questionStore } = useStores()
    return (
      <Provider questionStore={questionStore}>
      <Screen style={ROOT} preset="scroll">
        <View style={HEADER_CONTAINER}>
          <Text preset="header" tx="questionScreen.header" />
        </View>
      </Screen>
      </Provider>
    )
  }
  // render() {
  //   const { questionStore } = this.props
  //   const { questions } = questionStore

  //   return (
  //     <Screen style={ROOT} preset="fixed">
  //       <View style={HEADER_CONTAINER}>
  //         <Text preset="header" tx="questionScreen.header" />
  //       </View>
  //       <FlatList
  //         style={QUESTION_LIST}
  //         data={questionStore.questions}
  //         renderItem={this.renderQuestion}
  //         extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
  //         keyExtractor={item => item.id}
  //         onRefresh={this.fetchQuestions}
  //         refreshing={this.state.refreshing}
  //       />
  //     </Screen>
  //   )
  // }
}*/