import { withEnvironment } from "../extensions";
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Question, QuestionModel, QuestionSnapshot } from '../question/index'
import { GetQuestionsResult } from '../../services/api/index'

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.optional(types.array(QuestionModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveQuestions: (questionSnapshots: QuestionSnapshot[]) => {
      const questionModels: Question[] = questionSnapshots.map(c => QuestionModel.create(c)) // create model instances from the plain objects
      self.questions.replace(questionModels) // Replace the existing data with the new data
    },
  }))
  .actions(self => ({
    getQuestions: flow(function*() {
      const result: GetQuestionsResult = yield self.environment.api.getQuestions()
      if (result.kind === "ok") {
        console.log('results', result)
        self.saveQuestions(result.questions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type QuestionStoreType = Instance<typeof QuestionStoreModel>
export interface QuestionStore extends QuestionStoreType {}
type QuestionStoreSnapshotType = SnapshotOut<typeof QuestionStoreModel>
export interface QuestionStoreSnapshot extends QuestionStoreSnapshotType {}
