import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  return Answer.create(
    {
      authorId: new UniqueEntityID('valid-author-id'),
      questionId: new UniqueEntityID('valid-question-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
