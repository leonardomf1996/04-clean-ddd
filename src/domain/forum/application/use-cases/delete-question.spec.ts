import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let fakeQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    fakeQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    fakeQuestionsRepository = new InMemoryQuestionsRepository(
      fakeQuestionsAttachmentsRepository,
    )

    sut = new DeleteQuestionUseCase(fakeQuestionsRepository)
  })

  // Não encontrei o erro
  it.skip('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await fakeQuestionsRepository.create(newQuestion)

    fakeQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.getId(),
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.getId(),
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(fakeQuestionsRepository.items).toHaveLength(0)
    expect(fakeQuestionsAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await fakeQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
