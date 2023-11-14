import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    )

    this.items[itemIndex] = question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    return question
  }

  async findById(id: string): Promise<Question | null> {
    const idUnique = new UniqueEntityID(id)
    const question = this.items.find((item) => item.getId() === idUnique)

    if (!question) return null

    return question
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    )
    this.items.splice(itemIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      String(question.getId()),
    )
  }
}
