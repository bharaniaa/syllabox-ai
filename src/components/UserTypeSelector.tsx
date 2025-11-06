// User Type Selector Component
// Allows users to select their role during registration

import React from 'react';
import { UserType } from '../types/user';

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
  disabled?: boolean;
}

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    type: 'admin',
    title: 'Administrator',
    description: 'Full system access, user management, and system analytics',
    icon: '👑',
    color: 'bg-purple-500'
  },
  {
    type: 'staff',
    title: 'Faculty/Staff',
    description: 'Create lessons, manage quizzes, and track student progress',
    icon: '👨‍🏫',
    color: 'bg-blue-500'
  },
  {
    type: 'student',
    title: 'Student',
    description: 'Access courses, take quizzes, and track learning progress',
    icon: '👨‍🎓',
    color: 'bg-green-500'
  }
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Your Role
      </h3>
      
      <div className="grid gap-4">
        {userTypeOptions.map((option) => (
          <div
            key={option.type}
            className={`
              relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
              ${selectedType === option.type
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
            `}
            onClick={() => !disabled && onTypeSelect(option.type)}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl
                ${option.color}
              `}>
                {option.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900">
                  {option.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {option.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              <div className="flex-shrink-0">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedType === option.type
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedType === option.type && (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional info based on type */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              {option.type === 'admin' && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    System Management
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    User Analytics
                  </span>
                </div>
              )}
              
              {option.type === 'staff' && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Content Creation
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Student Management
                  </span>
                </div>
              )}
              
              {option.type === 'student' && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Course Access
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Progress Tracking
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Selection feedback */}
      {selectedType && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">
              Selected: {userTypeOptions.find(opt => opt.type === selectedType)?.title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

// User Type Badge Component
interface UserTypeBadgeProps {
  userType: UserType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const UserTypeBadge: React.FC<UserTypeBadgeProps> = ({
  userType,
  size = 'md',
  showIcon = true
}) => {
  const getBadgeConfig = (type: UserType) => {
    switch (type) {
      case 'admin':
        return {
          label: 'Administrator',
          className: 'bg-purple-100 text-purple-800',
          icon: '👑'
        };
      case 'staff':
        return {
          label: 'Faculty/Staff',
          className: 'bg-blue-100 text-blue-800',
          icon: '👨‍🏫'
        };
      case 'student':
        return {
          label: 'Student',
          className: 'bg-green-100 text-green-800',
          icon: '👨‍🎓'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800',
          icon: '❓'
        };
    }
  };

  const config = getBadgeConfig(userType);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.className}
      ${sizeClasses[size]}
    `}>
      {showIcon && (
        <span className="mr-1">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
};

export default UserTypeSelector;