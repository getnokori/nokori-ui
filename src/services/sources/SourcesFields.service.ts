import MySQLFields from '@/enums/sources/engines/MySQLFields.enum'
import type SourceEnginesEnum from '@/enums/sources/SourceEngines.enum'

type SourceFieldsDefinition = Partial<Record<SourceEnginesEnum, any>>

const SourceFieldsDefinition: SourceFieldsDefinition = {
  mysql: {
    HOST: {
      label: 'Host',
      type: 'text',
      placeholder: 'localhost',
      required: true,
      fieldName: MySQLFields.HOST
    },
    PORT: {
      label: 'Port',
      type: 'number',
      placeholder: 3306,
      required: false,
      fieldName: MySQLFields.PORT
    },
    USER: {
      label: 'User',
      type: 'text',
      placeholder: 'admin',
      required: true,
      fieldName: MySQLFields.USER
    },
    PASSWORD: {
      label: 'Password',
      type: 'text',
      placeholder: 'supersecurepassword',
      required: true,
      fieldName: MySQLFields.PASSWORD
    },
    DATABASE: {
      label: 'Database',
      type: 'text',
      placeholder: 'my_database',
      required: false,
      fieldName: MySQLFields.DATABASE
    }
  }
}

export default SourceFieldsDefinition
