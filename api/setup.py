from setuptools import setup
import sys

package_name='j7s_api'
semver = '0.0.0'

setup(name=package_name,
      version=semver,
      description='API for j7s.',
      author='James Pace',
      author_email='jpace121@gmail.com',
      url='git.jpace121.net',
      license='Apache 2.0',
      packages=[package_name],
      setup_requires=['wheel'],
      install_requires=['protobuf'],
      zip_safe=False)
