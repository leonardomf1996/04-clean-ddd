import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let fakeQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    fakeQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    fakeQuestionsRepository = new InMemoryQuestionsRepository(
      fakeQuestionsAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      fakeQuestionsRepository,
      fakeQuestionsAttachmentsRepository,
    )
  })

  it.skip('should be able to edit a question', async () => {
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
      title: 'new-title',
      content: 'new-content',
      questionId: 'question-1',
      attachmentsIds: ['1', '3'],
    })

    expect(fakeQuestionsRepository.items[0]).toMatchObject({
      title: 'new-title',
      content: 'new-content',
    })
    expect(
      fakeQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(fakeQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
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
        title: 'new-title',
        content: 'new-content',
        questionId: 'question-1',
        attachmentsIds: ['1', '2', '3'],
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
